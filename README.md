# jslide
Presentation software for nerds

![](images/jslidedemo.gif)

Dear ImGui interface with option to export the presentation to PDF.
![](images/jslideui.png)

## Building
Use CMake to build from source code. On Windows, all dependencies are delivered with the code.
On MacOs you have to install FFmpeg first. You can do this with the command

    brew install ffmpeg
    
It's possible that the links to the macos installed version of ffmpeg are incorrect in the CMakeLists.txt file. In that case you'll have to fix the links and let them point to the correct location.
It's also possible to build without FFmpeg. In that case, uncomment the line

    add_definitions(-D_FFMPEG_SUPPORTED)

in the CMakeLists.txt file.

## How to use
Build the application and then open the [demo.txt](examples/demo.txt) file in the examples folder. This demo file explains the syntax (which is sligthly based on Markdown).
