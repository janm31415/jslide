#pragma once

#include <string>
#include <vector>

struct token
  {
  enum e_type
    {
    T_HASH,
    T_TEXT,
    T_NEWLINE,
    T_NEWSLIDE
    };

  e_type type;
  int line_nr;
  int col_nr;
  std::string value;

  token(e_type i_type, const std::string& v, int i_line_nr, int i_col_nr) : type(i_type), value(v), line_nr(i_line_nr), col_nr(i_col_nr) {}
  };

typedef std::vector<token> tokens;
tokens tokenize(const std::string& str);