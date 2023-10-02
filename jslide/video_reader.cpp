#include "video_reader.h"

#include <sstream>
#include <string>

/*
From: https://github.com/bartjoyce/video-app
*/

static void throw_video_error(const char* format, const char* extra = nullptr)
  {
  std::stringstream str;
  str << format;
  if (extra != nullptr)
    str << extra;
  throw std::runtime_error(str.str());
  }

#ifdef _FFMPEG_SUPPORTED

// av_err2str returns a temporary array. This doesn't work in gcc.
// This function can be used as a replacement for av_err2str.
static const char* av_make_error(int errnum)
  {
  static char str[AV_ERROR_MAX_STRING_SIZE];
  memset(str, 0, sizeof(str));
  return av_make_error_string(str, AV_ERROR_MAX_STRING_SIZE, errnum);
  }

static AVPixelFormat correct_for_deprecated_pixel_format(AVPixelFormat pix_fmt)
  {
  // Fix swscaler deprecated pixel format warning
  // (YUVJ has been deprecated, change pixel format to regular YUV)
  switch (pix_fmt)
    {
    case AV_PIX_FMT_YUVJ420P: return AV_PIX_FMT_YUV420P;
    case AV_PIX_FMT_YUVJ422P: return AV_PIX_FMT_YUV422P;
    case AV_PIX_FMT_YUVJ444P: return AV_PIX_FMT_YUV444P;
    case AV_PIX_FMT_YUVJ440P: return AV_PIX_FMT_YUV440P;
    default:                  return pix_fmt;
    }
  }

bool video_reader_open(VideoReaderState* state, const char* filename)
  {

  // Unpack members of state
  auto& width = state->width;
  auto& height = state->height;
  auto& time_base = state->time_base;
  auto& av_format_ctx = state->av_format_ctx;
  auto& av_codec_ctx = state->av_codec_ctx;
  auto& video_stream_index = state->video_stream_index;
  auto& av_frame = state->av_frame;
  auto& av_packet = state->av_packet;

  // Open the file using libavformat
  av_format_ctx = avformat_alloc_context();
  if (!av_format_ctx) {
    throw_video_error("Couldn't created AVFormatContext");
    return false;
    }

  if (avformat_open_input(&av_format_ctx, filename, NULL, NULL) != 0)
    {
    throw_video_error("Couldn't open video file");
    return false;
    }

  // Find the first valid video stream inside the file
  video_stream_index = -1;
  AVCodecParameters* av_codec_params = nullptr;
  const AVCodec* av_codec = nullptr;
  for (unsigned int i = 0; i < av_format_ctx->nb_streams; ++i) {
    av_codec_params = av_format_ctx->streams[i]->codecpar;
    av_codec = avcodec_find_decoder(av_codec_params->codec_id);
    if (!av_codec)
      {
      continue;
      }
    if (av_codec_params->codec_type == AVMEDIA_TYPE_VIDEO)
      {
      video_stream_index = i;
      width = av_codec_params->width;
      height = av_codec_params->height;
      time_base = av_format_ctx->streams[i]->time_base;
      break;
      }
    }
  if (video_stream_index == -1) {
    throw_video_error("Couldn't find valid video stream inside file");
    return false;
    }

  // Set up a codec context for the decoder
  av_codec_ctx = avcodec_alloc_context3(av_codec);
  if (!av_codec_ctx) {
    throw_video_error("Couldn't create AVCodecContext");
    return false;
    }
  if (avcodec_parameters_to_context(av_codec_ctx, av_codec_params) < 0)
    {
    throw_video_error("Couldn't initialize AVCodecContext");
    return false;
    }
  if (avcodec_open2(av_codec_ctx, av_codec, NULL) < 0)
    {
    throw_video_error("Couldn't open codec");
    return false;
    }

  av_frame = av_frame_alloc();
  if (!av_frame) {
    throw_video_error("Couldn't allocate AVFrame");
    return false;
    }
  av_packet = av_packet_alloc();
  if (!av_packet) {
    throw_video_error("Couldn't allocate AVPacket");
    return false;
    }

  return true;
  }

bool video_reader_read_frame(VideoReaderState* state, uint8_t* frame_buffer, int64_t* pts)
  {

  // Unpack members of state
  auto& width = state->width;
  auto& height = state->height;
  auto& av_format_ctx = state->av_format_ctx;
  auto& av_codec_ctx = state->av_codec_ctx;
  auto& video_stream_index = state->video_stream_index;
  auto& av_frame = state->av_frame;
  auto& av_packet = state->av_packet;
  auto& sws_scaler_ctx = state->sws_scaler_ctx;

  // Decode one frame
  int response;
  state->endOfStream = true;
  while (av_read_frame(av_format_ctx, av_packet) >= 0)
    {
    state->endOfStream = false;
    if (av_packet->stream_index != video_stream_index)
      {
      av_packet_unref(av_packet);
      continue;
      }

    response = avcodec_send_packet(av_codec_ctx, av_packet);
    if (response < 0) {
      throw_video_error("Failed to decode packet: ", av_make_error(response));
      return false;
      }

    response = avcodec_receive_frame(av_codec_ctx, av_frame);
    if (response == AVERROR(EAGAIN) || response == AVERROR_EOF)
      {
      av_packet_unref(av_packet);
      continue;
      }
    else if (response < 0)
      {
      throw_video_error("Failed to decode packet: ", av_make_error(response));
      return false;
      }

    av_packet_unref(av_packet);
    break;
    }

  *pts = av_frame->pts;

  // Set up sws scaler
  if (!sws_scaler_ctx)
    {
    auto source_pix_fmt = correct_for_deprecated_pixel_format(av_codec_ctx->pix_fmt);
    sws_scaler_ctx = sws_getContext(width, height, source_pix_fmt,
      width, height, AV_PIX_FMT_RGB0,
      SWS_BILINEAR, NULL, NULL, NULL);
    }
  if (!sws_scaler_ctx)
    {
    throw_video_error("Couldn't initialize sw scaler");
    return false;
    }

  uint8_t* dest[4] = { frame_buffer, NULL, NULL, NULL };
  int dest_linesize[4] = { width * 4, 0, 0, 0 };
  sws_scale(sws_scaler_ctx, av_frame->data, av_frame->linesize, 0, av_frame->height, dest, dest_linesize);

  return true;
  }

bool video_reader_seek_frame(VideoReaderState* state, int64_t ts)
  {

  // Unpack members of state
  auto& av_format_ctx = state->av_format_ctx;
  auto& av_codec_ctx = state->av_codec_ctx;
  auto& video_stream_index = state->video_stream_index;
  auto& av_packet = state->av_packet;
  auto& av_frame = state->av_frame;

  av_seek_frame(av_format_ctx, video_stream_index, ts, AVSEEK_FLAG_BACKWARD);

  // av_seek_frame takes effect after one frame, so I'm decoding one here
  // so that the next call to video_reader_read_frame() will give the correct
  // frame
  int response;
  while (av_read_frame(av_format_ctx, av_packet) >= 0)
    {
    if (av_packet->stream_index != video_stream_index)
      {
      av_packet_unref(av_packet);
      continue;
      }

    response = avcodec_send_packet(av_codec_ctx, av_packet);
    if (response < 0)
      {
      throw_video_error("Failed to decode packet: %s", av_make_error(response));
      return false;
      }

    response = avcodec_receive_frame(av_codec_ctx, av_frame);
    if (response == AVERROR(EAGAIN) || response == AVERROR_EOF)
      {
      av_packet_unref(av_packet);
      continue;
      }
    else if (response < 0) {
      throw_video_error("Failed to decode packet: %s", av_make_error(response));
      return false;
      }

    av_packet_unref(av_packet);
    break;
    }

  return true;
  }

void video_reader_close(VideoReaderState* state)
  {
  sws_freeContext(state->sws_scaler_ctx);
  avformat_close_input(&state->av_format_ctx);
  avformat_free_context(state->av_format_ctx);
  av_frame_free(&state->av_frame);
  av_packet_free(&state->av_packet);
  avcodec_free_context(&state->av_codec_ctx);
  }


#else

bool video_reader_open(VideoReaderState* /*state*/, const char* /*filename*/)
  {
  return false;
  }
bool video_reader_read_frame(VideoReaderState* /*state*/, uint8_t* /*frame_buffer*/, int64_t* /*pts*/)
  {
  return false;
  }
bool video_reader_seek_frame(VideoReaderState* /*state*/, int64_t /*ts*/)
  {
  return false;
  }
void video_reader_close(VideoReaderState* /*state*/)
  {  
  }

#endif
