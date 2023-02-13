cmake_minimum_required(VERSION 3.10)
project (jslide)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/lib")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/lib")
set(CMAKE_PDB_OUTPUT_DIRECTORY     "${CMAKE_CURRENT_BINARY_DIR}/bin")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/bin")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
#set(CMAKE_CXX_EXTENSIONS OFF)

add_subdirectory(jtk)
add_subdirectory(jslide)
add_subdirectory(glew)
add_subdirectory(SDL2)
add_subdirectory(freetype)

set_property(GLOBAL PROPERTY USE_FOLDERS ON)

set_target_properties (jtk PROPERTIES FOLDER jtk)
set_target_properties (jtk.static.tests PROPERTIES FOLDER jtk)
set_target_properties (jtk.tests PROPERTIES FOLDER jtk)

set_target_properties (SDL2 PROPERTIES FOLDER sdl)
set_target_properties (SDL2main PROPERTIES FOLDER sdl)
set_target_properties (SDL2-static PROPERTIES FOLDER sdl)
set_target_properties (uninstall PROPERTIES FOLDER sdl)
set_target_properties (sdl_headers_copy PROPERTIES FOLDER sdl)
if (WIN32)
set_target_properties (SDL2_test PROPERTIES FOLDER sdl)
endif (WIN32)

set_target_properties (glew PROPERTIES FOLDER glew)