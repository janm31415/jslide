if (WIN32)
  set(OPENGL_LIBRARIES opengl32.lib CACHE FILEPATH "opengl lib file")
  set(GLX_LIBRARIES "")
  list(APPEND FFMPEG_LIBRARIES
    ${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/avcodec.lib
    #${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/avdevice.lib 
    #${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/avfilter.lib
    ${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/avformat.lib 
    ${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/avutil.lib 
    #${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/postproc.lib 
    #${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/swresample.lib 
    ${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/lib/swscale.lib 
  )
  set(FFMPEG_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/include)
  add_definitions(-D_FFMPEG_SUPPORTED)
endif (WIN32)

if (UNIX)
  if (APPLE)
    set(OPENGL_LIBRARIES "" CACHE FILEPATH "opengl lib file")
    set(GLX_LIBRARIES "")
    link_directories(/opt/homebrew/Cellar/ffmpeg/6.0_1/lib)
    set(FFMPEG_INCLUDE_DIR /opt/homebrew/Cellar/ffmpeg/6.0_1/include)
    list(APPEND FFMPEG_LIBRARIES
    avcodec avformat avutil swscale)
    add_definitions(-D_FFMPEG_SUPPORTED)
    set (CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -framework Cocoa -framework QuartzCore -framework Metal")
    set (CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -framework Cocoa -framework QuartzCore -framework Metal")
  else()
    set(OPENGL_LIBRARIES "/usr/lib/x86_64-linux-gnu/libOpenGL.so.0.0.0" CACHE FILEPATH "opengl lib file")
    set(GLX_LIBRARIES "/usr/lib/x86_64-linux-gnu/libGLX.so" CACHE FILEPATH "glx lib files")
  endif(APPLE)
endif (UNIX)

set(IMGUI
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imconfig.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_internal.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imstb_rectpack.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imstb_textedit.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imstb_truetype.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_draw.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_demo.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_tables.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_widgets.cpp

${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_sdl2.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_sdl2.cpp

${CMAKE_CURRENT_SOURCE_DIR}/../imgui/dirent_portable.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imguifilesystem.cpp
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imguifilesystem.h

${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_stdlib.h
${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_stdlib.cpp
)

if (APPLE)
list(APPEND IMGUI ${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_metal.h)
list(APPEND IMGUI ${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_metal.mm)
else (APPLE)
list(APPEND IMGUI ${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_opengl3.h)
list(APPEND IMGUI ${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_opengl3_loader.h)
list(APPEND IMGUI ${CMAKE_CURRENT_SOURCE_DIR}/../imgui/imgui_impl_opengl3.cpp)
endif (APPLE)

set(HDRS
colors.h
debug.h
defines.h
image.h
image_helper.h
jpg2pdf.h
keyboard.h
logging.h
material.h
mouse_data.h
nester.h
parser.h
pref_file.h
settings.h
shaders.h
sizing.h
slide.h
syntax_highlight.h
tokenizer.h
video_reader.h
view.h
    )
	
set(SRCS
colors.cpp
debug.cpp
image_helper.cpp
jpg2pdf.cpp
logging.cpp
image.cpp
main.cpp
material.cpp
nester.cpp
parser.cpp
pref_file.cpp
settings.cpp
shaders.cpp
slide.cpp
sizing.cpp
syntax_highlight.cpp
tokenizer.cpp
video_reader.cpp
view.cpp
)

set(JSON
${CMAKE_CURRENT_SOURCE_DIR}/../json/json.hpp
)

set(STB
${CMAKE_CURRENT_SOURCE_DIR}/../stb/stb_image.h
${CMAKE_CURRENT_SOURCE_DIR}/../stb/stb_image_write.h
)

set(SHADERS
)

if (APPLE)
list(APPEND HDRS ../SDL-metal/SDL_metal.h)
list(APPEND SRCS ../SDL-metal/SDL_metal.mm)
list(APPEND SHADERS ../RenderDoos/RenderDoos/shaders.metal)
list(APPEND SHADERS jslide_shaders.metal)
endif (APPLE)

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
#add_definitions(-DIMGUI_IMPL_OPENGL_LOADER_GLEW)

if (WIN32)
add_executable(jslide WIN32 ${HDRS} ${SRCS} ${SHADERS} ${IMGUI} ${JSON} jslide.rc resource.h)
else()
add_executable(jslide ${HDRS} ${SRCS} ${IMGUI} ${SHADERS} ${JSON} ${STB})
endif(WIN32)

if (APPLE)
set_source_files_properties(${SHADERS} PROPERTIES LANGUAGE METAL)
endif (APPLE)


source_group("Header Files" FILES ${hdrs})
source_group("Source Files" FILES ${srcs})
source_group("ThirdParty/ImGui" FILES ${IMGUI})
source_group("ThirdParty/json" FILES ${JSON})
source_group("ThirdParty/stb" FILES ${STB})

 target_include_directories(jslide
    PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/../
    ${CMAKE_CURRENT_SOURCE_DIR}/../freetype/include
    ${CMAKE_CURRENT_SOURCE_DIR}/../jtk
    ${CMAKE_CURRENT_SOURCE_DIR}/../imgui/
    ${CMAKE_CURRENT_SOURCE_DIR}/../json/
    ${CMAKE_CURRENT_SOURCE_DIR}/../SDL2/include/
    ${CMAKE_CURRENT_SOURCE_DIR}/../stb/
    ${CMAKE_CURRENT_SOURCE_DIR}/../RenderDoos/
    ${CMAKE_CURRENT_SOURCE_DIR}/../RenderDoos/glew/include
    ${CMAKE_CURRENT_SOURCE_DIR}/../RenderDoos/glew/include/glew
    ${FFMPEG_INCLUDE_DIR}
    )	
	
if (${JSLIDE_PLATFORM} STREQUAL "win32")
target_link_libraries(jslide
    PRIVATE	
    RenderDoos
    SDL2
    SDL2main     
    freetype
    libglew
    ${OPENGL_LIBRARIES} 
    ${GLX_LIBRARIES}
    ${FFMPEG_LIBRARIES}
    )	
else (${JSLIDE_PLATFORM} STREQUAL "win32")
target_link_libraries(jslide
    PRIVATE	
    RenderDoos
    SDL2
    SDL2main     
    freetype
    ${FFMPEG_LIBRARIES}
    )
endif (${JSLIDE_PLATFORM} STREQUAL "win32")
      
if (WIN32)
add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/data" "${CMAKE_CURRENT_BINARY_DIR}/data")
add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/bin" "${CMAKE_CURRENT_BINARY_DIR}")
add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/../ffmpeg/bin" "$<TARGET_FILE_DIR:jslide>")
endif (WIN32)

add_custom_command(TARGET jslide POST_BUILD 
    COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/data" "$<TARGET_FILE_DIR:jslide>/data")

if (WIN32)
add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/shaders/gl" "${CMAKE_CURRENT_BINARY_DIR}/shaders")
else (WIN32)
  if (APPLE)
    add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/shaders/metal" "$<TARGET_FILE_DIR:jslide>/shaders")  
  else (APPLE)
    add_custom_command(TARGET jslide POST_BUILD 
   COMMAND ${CMAKE_COMMAND} -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/shaders/gl" "$<TARGET_FILE_DIR:jslide>/shaders")  
   endif(APPLE)
endif (WIN32)



add_custom_command(TARGET jslide POST_BUILD
   COMMAND ${CMAKE_COMMAND} -E copy "${CMAKE_CURRENT_SOURCE_DIR}/jslide_syntax.json" "$<TARGET_FILE_DIR:jslide>/jslide_syntax.json")

if (WIN32)
add_custom_command(TARGET jslide POST_BUILD
   COMMAND ${CMAKE_COMMAND} -E copy "${CMAKE_CURRENT_SOURCE_DIR}/../images/yoda.jpg" "${CMAKE_CURRENT_BINARY_DIR}/yoda.jpg")
endif (WIN32)

add_custom_command(TARGET jslide POST_BUILD
   COMMAND ${CMAKE_COMMAND} -E copy "${CMAKE_CURRENT_SOURCE_DIR}/../images/yoda.jpg" "$<TARGET_FILE_DIR:jslide>/yoda.jpg")
