#include "tokenizer.h"
#include "parser.h"

namespace
  {

  bool _has_dashes_only(const std::string& buff)
    {
    for (size_t i = 0; i < buff.length(); ++i)
      if (buff[i] != '-')
        return false;
    return true;
    }

  void _treat_buffer(std::string& buff, std::vector<token>& tokes, int line_nr, int col_nr)
    {
    if (!buff.empty())
      {
      if (buff.size()>=4 && _has_dashes_only(buff))
        tokes.emplace_back(token::T_LINE, "----", line_nr, col_nr);
      else
        tokes.emplace_back(token::T_TEXT, buff, line_nr, col_nr);
      buff.clear();
      }
    }

  bool _buffer_contains_characters_other_than_space(const std::string& buff)
    {
    for (size_t i = 0; i < buff.size(); ++i)
      if (buff[i] != ' ')
        return true;
    return false;
    }
  }

tokens tokenize(const std::string& str)
  {
  tokens tokes;
  std::string buff;

  const char* s = str.c_str();
  const char* s_end = str.c_str() + str.length();

  int line_nr = 1;
  int col_nr = 1;
  int buff_start_col_nr = -1;

  bool newline = true;

  bool attributes_list = false;

  while (s < s_end)
    {

    const char* s_copy = s;
    switch (*s)
      {
      case '{':
      {      
      const char* t = s; ++t;
      if (*t == ':')
        {
        _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
        s = t+1;
        tokes.emplace_back(token::T_ATTRIBUTE_BEGIN, "{:", line_nr, col_nr);
        col_nr += 2;
        newline = false;
        attributes_list = true;
        }        
      break;
      }
      case '}':
      {
      if (attributes_list)
        {
        _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
        ++s;
        tokes.emplace_back(token::T_ATTRIBUTE_END, "}", line_nr, col_nr);
        ++col_nr;
        attributes_list = false;
        }
      break;
      }
      case ' ':
      {
      if (attributes_list)
        {
        _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
        ++s;
        ++col_nr;
        }
      else
        {
        if (_buffer_contains_characters_other_than_space(buff))
          _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
        }
      break;
      }
      case '#':
      {
      if (newline && !attributes_list)
        {
        const char* t = s; ++t;
        while (*t == '#')
          ++t;
        if (*t == ' ')
          {
          int nr_of_hashes = (int)(t - s);
          s = ++t;
          for (int i = 0; i < nr_of_hashes; ++i)
            tokes.emplace_back(token::T_HASH, "#", line_nr, i);
          col_nr = 1 + nr_of_hashes + 1;
          newline = false;
          }
        }
      break;
      }
      case '`':
      {
      _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
      tokes.emplace_back(token::T_CODE_BLOCK_BEGIN, "`", line_nr, col_nr);
      const char* t = s; ++t;
      ++col_nr;
      int code_block_col_nr = col_nr;
      int code_block_line_nr = line_nr;
      std::string code;
      while (*t && *t != '`')
        {
        code.push_back(*t);
        if (*t == '\n')
          {
          code.pop_back();
          if (!code.empty())
            tokes.emplace_back(token::T_TEXT, code, code_block_line_nr, code_block_col_nr);
          tokes.emplace_back(token::T_NEWLINE, code, line_nr, col_nr);
          ++line_nr;
          col_nr = 1;
          code_block_line_nr = line_nr;
          code_block_col_nr = col_nr;
          code.clear();
          }
        else
          ++col_nr;
        ++t;
        }     
      if (!code.empty())
        tokes.emplace_back(token::T_TEXT, code, code_block_line_nr, code_block_col_nr);
      tokes.emplace_back(token::T_CODE_BLOCK_END, "`", line_nr, col_nr);
      ++t;
      s = t;
      break;
      }
      case '\n':
      {
      _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
      tokes.emplace_back(token::T_NEWLINE, "\\n", line_nr, col_nr);
      col_nr = 1;
      ++line_nr;
      newline = true;
      ++s;
      break;
      }
      case '!':
      {
      if (newline && !attributes_list)
        {
        const char* t = s; ++t;
        if (*t == '"') // shadercode
          {
          _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
          tokes.emplace_back(token::T_SHADER_BEGIN, "!\"", line_nr, col_nr);
          ++t;
          col_nr += 2;
          int text_col_nr = col_nr;
          int text_line_nr = line_nr;
          std::string shader_code;
          while (*t && *t != '"')
            {
            shader_code.push_back(*t);
            if (*t == '\n')
              {
              ++line_nr;
              col_nr = 1;
              }
            else 
              ++col_nr;
            ++t;
            }
          tokes.emplace_back(token::T_TEXT, shader_code, text_line_nr, text_col_nr);
          tokes.emplace_back(token::T_SHADER_END, "\"", line_nr, col_nr);
          if (*t)
            ++t;
          if (*t == '\n')
            {
            ++line_nr;
            col_nr = 1;
            newline = true;
            ++t;
            }
          s = t;
          }
        else if (*t == '[') // image, has format ![w h](/path/image.ext)
          {
          _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
          tokes.emplace_back(token::T_IMAGE_DIM_BEGIN, "![", line_nr, col_nr);
          ++t;
          col_nr += 2;
          int dimensions_col_nr = col_nr;
          std::string image_dimensions;
          while (*t && *t != ']')
            {
            if (*t == '\n')
              throw_parse_error(line_nr, col_nr, "No newline expected");
            image_dimensions.push_back(*t);
            ++t;
            ++col_nr;
            }
          if (!*t)
            throw_parse_error(line_nr, col_nr, "] expected");
          tokes.emplace_back(token::T_IMAGE_DIM, image_dimensions, line_nr, dimensions_col_nr);
          tokes.emplace_back(token::T_IMAGE_DIM_END, "]", line_nr, col_nr);
          ++t;
          ++col_nr;
          if (*t != '(')
            throw_parse_error(line_nr, col_nr, "( expected");
          tokes.emplace_back(token::T_IMAGE_PATH_BEGIN, "(", line_nr, col_nr);
          ++t;
          ++col_nr;
          int path_col_nr = col_nr;
          std::string image_path;
          while (*t && *t != ')')
            {
            if (*t == '\n')
              throw_parse_error(line_nr, col_nr, "No newline expected");
            image_path.push_back(*t);
            ++t;
            ++col_nr;
            }
          if (!*t)
            throw_parse_error(line_nr, col_nr, ") expected");
          tokes.emplace_back(token::T_IMAGE_PATH, image_path, line_nr, path_col_nr);
          tokes.emplace_back(token::T_IMAGE_PATH_END, ")", line_nr, col_nr);
          ++t;
          ++col_nr;
          s = t;
          }
        }
      break;
      }
      case '@':
      {
      if (newline && !attributes_list)
        {
        const char* t = s; ++t;
        if (*t == '\n')
          {
          s+=2;
          tokes.emplace_back(token::T_NEWSLIDE, "@", line_nr, col_nr);
          col_nr = 1;
          ++line_nr;
          newline = true;
          }
        else if (*t == '@')
          {
          ++t;
          if (*t == '\n')
            {
            s += 2;
            tokes.emplace_back(token::T_ADDTOSLIDE, "@@", line_nr, col_nr);
            col_nr = 1;
            ++line_nr;
            newline = true;
            }
          }
        }
      break;
      }
      } // switch (*s)

    if (*s_copy && (s_copy == s))
      {
      if (buff.empty())
        buff_start_col_nr = col_nr;
      buff += *s;
      ++s;
      ++col_nr;
      newline = false;
      }
    }
  _treat_buffer(buff, tokes, line_nr, buff_start_col_nr);
  return tokes;
  }