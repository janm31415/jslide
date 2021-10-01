#include "shader_gl.h"
#include "shaders.h"

void init_shader_data(shader_t* state, const std::string& shader_script, uint32_t width, uint32_t height)
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

  state->shader_vao.create();
  gl_check_error("state->shader_vao.create()");
  state->shader_vao.bind();
  gl_check_error("state->shader_vao.bind()");

  state->shader_vbo = buffer_object(GL_ARRAY_BUFFER);
  state->shader_vbo.create();
  state->shader_vbo.bind();
  state->shader_vbo.set_usage_pattern(GL_STATIC_DRAW);
  state->shader_vbo.allocate(vertices, sizeof(vertices));

  state->shader_ebo = buffer_object(GL_ELEMENT_ARRAY_BUFFER);
  state->shader_ebo.create();
  state->shader_ebo.bind();
  state->shader_ebo.set_usage_pattern(GL_STATIC_DRAW);
  state->shader_ebo.allocate(elements, sizeof(elements));

  std::string vertex_shader = get_shader_vertex_shader();

  std::string header = get_shader_fragment_header();

  std::string footer = get_shader_fragment_footer();

  std::string fragment_shader = header;
  fragment_shader.append(shader_script);
  fragment_shader.append(footer);

  state->shader_program.add_shader_from_source(shader::shader_type::Vertex, vertex_shader);
  state->shader_program.add_shader_from_source(shader::shader_type::Fragment, fragment_shader);
  state->shader_program.link();

  state->shader_program.enable_attribute_array(0);
  state->shader_program.set_attribute_buffer(0, GL_FLOAT, 0, 2, sizeof(GLfloat) * 2); // x y

  state->shader_program.release();
  state->shader_vao.release();
  state->shader_vbo.release();
  state->shader_ebo.release();
  gl_check_error("init_shader_data");
  }

void destroy_shader_data(shader_t* state)
  {
  using namespace jtk;
  state->shader_program.release();
  state->shader_vao.release();
  state->shader_vbo.release();
  state->shader_ebo.release();

  state->shader_program.remove_all_shaders();
  state->shader_vao.destroy();
  state->shader_vbo.destroy();
  state->shader_ebo.destroy();

  gl_check_error("destroy_shader_data");
  }

void draw_shader_data(shader_t* state, const shader_parameters& params)
  {
  using namespace jtk;
  glViewport(0, 0, state->width, state->height);
  glClearColor(0.f, 0.f, 0.f, 1.f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  state->shader_vao.bind();
  state->shader_vbo.bind();
  state->shader_ebo.bind();
  state->shader_program.bind();
  
  state->shader_program.set_uniform_value("iResolution", (GLfloat)state->width, (GLfloat)state->height, 1.f);    
  state->shader_program.set_uniform_value("iTime", (GLfloat)params.time);
  state->shader_program.set_uniform_value("iGlobalTime", (GLfloat)params.time);
  state->shader_program.set_uniform_value("iFrame", (GLint)params.frame);

  glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
  gl_check_error("glDrawElements");
  state->shader_program.release();
  state->shader_ebo.release();
  state->shader_vbo.release();
  state->shader_vao.release();
  gl_check_error("draw_shader_data");
  }