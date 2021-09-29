#include "blit_gl.h"
#include "shaders.h"

void init_blit_data(blit_t* state, uint32_t blit_x, uint32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h)
  {
  using namespace jtk;
  float width = 2.f * (float)blit_w / (float)view_w;
  float height = 2.f * (float)blit_h / (float)view_h;

  float x0 = ((float)blit_x / (float)view_w) * 2.f - 1.f;
  float y0 = 1.f - 2.f * ((float)blit_y / (float)view_h);
  float x1 = x0 + width;
  float y1 = y0 - height;

  GLfloat vertices[] = {
  (GLfloat)x0,  (GLfloat)y0,
  (GLfloat)x1,  (GLfloat)y0,
  (GLfloat)x1,  (GLfloat)y1,
  (GLfloat)x0,  (GLfloat)y1
    };

  GLuint elements[] = {
      0, 1, 2,
      0, 2, 3
    };

  state->blit_x = blit_x;
  state->blit_y = blit_y;
  state->blit_w = blit_w;
  state->blit_h = blit_h;
  state->view_w = view_w;
  state->view_h = view_h;

  state->blit_vao.create();
  gl_check_error("state->blit_vao.create()");
  state->blit_vao.bind();
  gl_check_error("state->blit_vao.bind()");

  state->blit_vbo = buffer_object(GL_ARRAY_BUFFER);
  state->blit_vbo.create();
  state->blit_vbo.bind();
  state->blit_vbo.set_usage_pattern(GL_STATIC_DRAW);
  state->blit_vbo.allocate(vertices, sizeof(vertices));

  state->blit_ebo = buffer_object(GL_ELEMENT_ARRAY_BUFFER);
  state->blit_ebo.create();
  state->blit_ebo.bind();
  state->blit_ebo.set_usage_pattern(GL_STATIC_DRAW);
  state->blit_ebo.allocate(elements, sizeof(elements));

  std::string vertex_shader = get_blit_vertex_shader();
  std::string fragment_shader = get_blit_fragment_shader();

  state->blit_program.add_shader_from_source(shader::shader_type::Vertex, vertex_shader);
  state->blit_program.add_shader_from_source(shader::shader_type::Fragment, fragment_shader);
  state->blit_program.link();

  state->blit_program.enable_attribute_array(0);
  state->blit_program.set_attribute_buffer(0, GL_FLOAT, 0, 2, sizeof(GLfloat) * 2); // x y

  state->blit_program.release();
  state->blit_vao.release();
  state->blit_vbo.release();
  state->blit_ebo.release();
  gl_check_error("init_blit_data");
  }

void destroy_blit_data(blit_t* state)
  {
  using namespace jtk;
  state->blit_program.release();
  state->blit_vao.release();
  state->blit_vbo.release();
  state->blit_ebo.release();

  state->blit_program.remove_all_shaders();
  state->blit_vao.destroy();
  state->blit_vbo.destroy();
  state->blit_ebo.destroy();

  gl_check_error("destroy_blit_data");
  }

void draw_blit_data(blit_t* state, jtk::texture* tex, uint32_t vp_w, uint32_t vp_h)
  {
  using namespace jtk;
  glViewport(0, 0, vp_w, vp_h);
  state->blit_vao.bind();
  state->blit_vbo.bind();
  state->blit_ebo.bind();
  state->blit_program.bind();
  tex->bind_to_channel(0);
  gl_check_error("tex->bind_to_channel(0)");
  state->blit_program.set_uniform_value("iBlitResolution", (GLfloat)state->blit_w, (GLfloat)state->blit_h);
  state->blit_program.set_uniform_value("iBlitOffset", (GLfloat)state->blit_x, (GLfloat)(vp_h - state->blit_y));
  state->blit_program.set_uniform_value("iChannel0", 0);

  //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
  //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

  glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
  gl_check_error("glDrawElements");
  state->blit_program.release();
  state->blit_ebo.release();
  state->blit_vbo.release();
  state->blit_vao.release();
  gl_check_error("draw_blit_data");
  }