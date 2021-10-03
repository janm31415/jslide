#include "transfer_gl.h"
#include "shaders.h"

namespace
  {
  int transfer_animation_to_int(transfer_animation anim)
    {
    switch (anim)
      {
      case transfer_animation::T_NONE: return -1;
      case transfer_animation::T_FADE: return 0;
      case transfer_animation::T_DIA: return 1;
      case transfer_animation::T_SPLIT: return 2;
      case transfer_animation::T_ZOOM: return 3;
      }
    return 0;
    }
  }

void init_transfer_data(transfer_t* state, uint32_t width, uint32_t height)
  {
  using namespace jtk;
  GLfloat vertices[] = {
  (GLfloat)-1,  (GLfloat)-1,
  (GLfloat)1,  (GLfloat)-1,
  (GLfloat)1,  (GLfloat)1,
  (GLfloat)-1,  (GLfloat)1
    };

  GLuint elements[] = {
      0, 1, 2,
      0, 2, 3
    };

  state->width = width;
  state->height = height;

  state->vao.create();
  gl_check_error("state->vao.create()");
  state->vao.bind();
  gl_check_error("state->vao.bind()");

  state->vbo = buffer_object(GL_ARRAY_BUFFER);
  state->vbo.create();
  state->vbo.bind();
  state->vbo.set_usage_pattern(GL_STATIC_DRAW);
  state->vbo.allocate(vertices, sizeof(vertices));

  state->ebo = buffer_object(GL_ELEMENT_ARRAY_BUFFER);
  state->ebo.create();
  state->ebo.bind();
  state->ebo.set_usage_pattern(GL_STATIC_DRAW);
  state->ebo.allocate(elements, sizeof(elements));

  std::string vertex_shader = get_transfer_vertex_shader();
  std::string fragment_shader = get_transfer_fragment_shader();

  state->program.add_shader_from_source(shader::shader_type::Vertex, vertex_shader);
  state->program.add_shader_from_source(shader::shader_type::Fragment, fragment_shader);
  state->program.link();

  state->program.enable_attribute_array(0);
  state->program.set_attribute_buffer(0, GL_FLOAT, 0, 2, sizeof(GLfloat) * 2); // x y

  state->program.release();
  state->vao.release();
  state->vbo.release();
  state->ebo.release();

  state->fbo.create(width, height);
  state->fbo.release();

  gl_check_error("init_transfer_data");
  }

void destroy_transfer_data(transfer_t* state)
  {
  state->program.release();
  state->vao.release();
  state->vbo.release();
  state->ebo.release();
  state->fbo.release();
  state->program.remove_all_shaders();
  }

void draw_transfer_data(transfer_t* state, jtk::texture* tex, float time, float max_time, transfer_animation anim)
  {
  using namespace jtk;
  glViewport(0, 0, state->width, state->height);
  int method = transfer_animation_to_int(anim);
  state->vao.bind();
  state->vbo.bind();
  state->ebo.bind();
  state->program.bind();
  tex->bind_to_channel(0);
  state->fbo.bind(10);
  gl_check_error("tex->bind_to_channel(0)");
  state->program.set_uniform_value("iResolution", (GLfloat)state->width, (GLfloat)state->height);    
  state->program.set_uniform_value("iChannel0", 0);
  state->program.set_uniform_value("iTime", (GLfloat)time);
  state->program.set_uniform_value("iMaxTime", (GLfloat)max_time);
  state->program.set_uniform_value("iMethod", (GLint)method);

  glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
  gl_check_error("glDrawElements");
  state->program.release();
  state->ebo.release();
  state->vbo.release();
  state->vao.release();
  tex->release();
  state->fbo.release();
  gl_check_error("draw_blit_data");
  }