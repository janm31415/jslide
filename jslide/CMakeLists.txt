if (WIN32)
  set(OPENGL_LIBRARIES opengl32.lib CACHE FILEPATH "opengl lib file")
endif (WIN32)

if (UNIX)
  if (APPLE)
    set(OPENGL_LIBRARIES "/System/Library/Frameworks/OpenGL.framework/OpenGL" CACHE FILEPATH "opengl lib file")
  else()
    set(OPENGL_LIBRARIES "/usr/lib/x86_64-linux-gnu/libOpenGL.so.0.0.0" CACHE FILEPATH "opengl lib file")
  endif(APPLE)
endif (UNIX)

set(IMGUI
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_impl_opengl3.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_impl_sdl.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_stdlib.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/dirent_portable.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imguifilesystem.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_draw.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_demo.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_impl_opengl3.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_impl_sdl.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_stdlib.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_tables.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imgui_widgets.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/imguifilesystem.cpp
)

set(HDRS
blit_gl.h
font_gl.h
image_helper.h
keyboard.h
logging.h
mouse_data.h
pref_file.h
settings.h
shaders.h
trackball.h
utils_gl.h
view.h
    )
	
set(SRCS
blit_gl.cpp
font_gl.cpp
image_helper.cpp
logging.cpp
main.cpp
pref_file.cpp
settings.cpp
shaders.cpp
trackball.c
utils_gl.cpp
view.cpp
)

set(GLEW
glew.cpp
)

set(JSON
${CMAKE_CURRENT_SOURCE_DIR}/../json/json.hpp
)

set(STB
${CMAKE_CURRENT_SOURCE_DIR}/../stb/stb_image.h
${CMAKE_CURRENT_SOURCE_DIR}/../stb/stb_image_write.h
)



if (WIN32)
set(CMAKE_C_FLAGS_DEBUG "/W4 /MP /GF /RTCu /Od /MDd /Zi")
set(CMAKE_CXX_FLAGS_DEBUG "/W4 /MP /GF /RTCu /Od /MDd /Zi")
set(CMAKE_C_FLAGS_RELEASE "/W4 /MP /GF /O2 /Ob2 /Oi /Ot /MD /Zi")
set(CMAKE_CXX_FLAGS_RELEASE "/W4 /MP /GF /O2 /Ob2 /Oi /Ot /MD /Zi")
endif(WIN32)

include ("../jtk/jtk/jtk.cmake")

# general build definitions
add_definitions(-DNOMINMAX)
add_definitions(-D_UNICODE)
add_definitions(-DUNICODE)
add_definitions(-D_SCL_SECURE_NO_WARNINGS)
add_definitions(-D_CRT_SECURE_NO_WARNINGS)
add_definitions(-DIMGUI_IMPL_OPENGL_LOADER_GLEW)

if (WIN32)
add_executable(jslide WIN32 ${HDRS} ${SRCS} ${GLEW} ${IMGUI} ${JSON} jslide.rc resource.h)
else()
add_executable(jslide ${HDRS} ${SRCS} ${GLEW} ${IMGUI} ${JSON} ${STB})
endif(WIN32)
source_group("Header Files" FILES ${hdrs})
source_group("Source Files" FILES ${srcs})
source_group("ThirdParty/Glew" FILES ${GLEW})
source_group("ThirdParty/ImGui" FILES ${IMGUI})
source_group("ThirdParty/json" FILES ${JSON})
source_group("ThirdParty/stb" FILES ${STB})

 target_include_directories(jslide
    PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/../
    ${CMAKE_CURRENT_SOURCE_DIR}/../freetype/include
    ${CMAKE_CURRENT_SOURCE_DIR}/../jtk
   	${CMAKE_CURRENT_SOURCE_DIR}/../glew/include
    ${CMAKE_CURRENT_SOURCE_DIR}/../glew/include/glew
    ${CMAKE_CURRENT_SOURCE_DIR}/../imgui_sdl/
    ${CMAKE_CURRENT_SOURCE_DIR}/../json/
    ${CMAKE_CURRENT_SOURCE_DIR}/../SDL2/include/
    ${CMAKE_CURRENT_SOURCE_DIR}/../stb/
    )	
	
target_link_libraries(jslide
    PRIVATE	
    SDL2
    SDL2main     
    freetype
    ${OPENGL_LIBRARIES} 
    )	
    
      
if (WIN32)
add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/data" "${CMAKE_CURRENT_BINARY_DIR}/data")
endif (WIN32)

if (UNIX)
add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/data" "$<TARGET_FILE_DIR:jslide>/data")
endif (UNIX)    