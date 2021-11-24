#pragma once

/*
From: https://github.com/bartjoyce/video-app
*/

#include <stdint.h>

#ifdef _FFMPEG_SUPPORTED

extern "C" {
#include "libavcodec/avcodec.h"
#include "libavformat/avformat.h"
#include "libswscale/swscale.h"
}

struct VideoReaderState {  
  int width=0, height=0;
  AVRational time_base;
  
  AVFormatContext* av_format_ctx = nullptr;
  AVCodecContext* av_codec_ctx = nullptr;
  int video_stream_index;
  AVFrame* av_frame = nullptr;
  AVPacket* av_packet = nullptr;
  SwsContext* sws_scaler_ctx = nullptr;
};

#else
struct VideoReaderState 
  {
  int width = 0, height = 0;
  };
#endif

bool video_reader_open(VideoReaderState* state, const char* filename);
bool video_reader_read_frame(VideoReaderState* state, uint8_t* frame_buffer, int64_t* pts);
bool video_reader_seek_frame(VideoReaderState* state, int64_t ts);
void video_reader_close(VideoReaderState* state);