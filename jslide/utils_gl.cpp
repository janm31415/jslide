#include "utils_gl.h"
#include <sstream>

#define JTK_OPENGL_IMPLEMENTATION
#include "jtk/opengl.h"

void check()
  {
  GLenum err = glGetError();
  if (err != GL_NO_ERROR) {
    printf("GL Error: %d\n", err);
    exit(EXIT_FAILURE);
    }
  }
