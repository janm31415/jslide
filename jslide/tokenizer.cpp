#include "tokenizer.h"

namespace
  {


  void _treat_buffer(std::string& buff, std::vector<token>& tokes, int line_nr, int col_nr)
    {
    if (!buff.empty())
      {
      tokes.emplace_back(token::T_TEXT, buff, line_nr, col_nr);
      buff.clear();
      }
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
          if (*t)
            ++t;
          if (*t == '\n')
            {
            ++line_nr;
            col_nr = 1;
            newline = true;
            ++t;
            }
          tokes.emplace_back(token::T_TEXT, shader_code, line_nr, col_nr);
          tokes.emplace_back(token::T_SHADER_END, "\"", line_nr, col_nr);
          s = t;
          }
        else if (*t == '[') // image
          {
          // todo
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