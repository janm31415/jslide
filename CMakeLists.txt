cmake_minimum_required(VERSION 3.10)
project (jslide)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/lib")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/lib")
set(CMAKE_PDB_OUTPUT_DIRECTORY     "${CMAKE_CURRENT_BINARY_DIR}/bin")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/bin")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
#set(CMAKE_CXX_EXTENSIONS OFF)

set(JSLIDE_PLATFORM "win32" CACHE STRING "Choose your target platform: win32 or macos.")
set(JSLIDE_ARCHITECTURE "x64" CACHE STRING  "Choose your target architecture: x64 compatible pc or arm.")

set_property(CACHE JSLIDE_PLATFORM PROPERTY STRINGS win32 macos)
set_property(CACHE JSLIDE_ARCHITECTURE PROPERTY STRINGS x64 arm)

set(RENDERDOOS_SIMD OFF CACHE BOOL "RenderDoos no simd" FORCE)

if (${JSLIDE_PLATFORM} STREQUAL "win32")
set(RENDERDOOS_PLATFORM "win32" CACHE STRING "Choose your target platform: win32, linux, macos or ios." FORCE)
endif (${JSLIDE_PLATFORM} STREQUAL "win32")
if (${JSLIDE_PLATFORM} STREQUAL "macos")
set(RENDERDOOS_PLATFORM "macos" CACHE STRING "Choose your target platform: win32, linux, macos or ios." FORCE)
endif (${JSLIDE_PLATFORM} STREQUAL "macos")

if (${JSLIDE_ARCHITECTURE} STREQUAL "arm")
set(RENDERDOOS_ARCHITECTURE "arm" CACHE STRING "Choose your target architecture: x64 compatible pc or arm." FORCE)
set(JTK_TARGET "arm" CACHE STRING "Choose your target platform: x64 compatible pc or arm." FORCE)
endif (${JSLIDE_ARCHITECTURE} STREQUAL "arm")

if (${JSLIDE_ARCHITECTURE} STREQUAL "x64")
set(RENDERDOOS_ARCHITECTURE "x64" CACHE STRING "Choose your target architecture: x64 compatible pc or arm." FORCE)
set(JTK_TARGET "x64" CACHE STRING "Choose your target platform: x64 compatible pc or arm." FORCE)
endif (${JSLIDE_ARCHITECTURE} STREQUAL "x64")

set(JTK_MAT_PARALLEL OFF CACHE BOOL "JTK Mat parallel" FORCE)
set(JTK_NO_SIMD ON CACHE BOOL "JTK no simd" FORCE)

message("jslide Platform = ${JSLIDE_PLATFORM}")
message("RenderDoos Platform = ${RENDERDOOS_PLATFORM}")
message("jslide Architecture = ${JSLIDE_ARCHITECTURE}")
message("RenderDoos Architecture = ${RENDERDOOS_ARCHITECTURE}")

add_subdirectory(freetype)
add_subdirectory(jtk)
if (${JSLIDE_PLATFORM} STREQUAL "win32")
add_subdirectory(glew)
endif (${JSLIDE_PLATFORM} STREQUAL "win32")
add_subdirectory(RenderDoos)
add_subdirectory(SDL2)
add_subdirectory(jslide)

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
set_target_properties (libglew PROPERTIES FOLDER glew)
endif (WIN32)
