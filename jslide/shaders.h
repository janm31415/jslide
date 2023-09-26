#pragma once

#include <string>

std::string get_blit_vertex_shader();
std::string get_blit_fragment_shader();

std::string get_font_material_vertex_shader();
std::string get_font_material_fragment_shader();

std::string get_shadertoy_material_vertex_shader();
std::string get_shadertoy_material_fragment_shader_header();
std::string get_shadertoy_material_fragment_shader_footer();

std::string get_transfer_vertex_shader();
std::string get_transfer_fragment_shader();
