#ifndef _SDL_main_h
#define _SDL_main_h
#endif

#include <SDL.h>

#include <stdio.h>
#include <string.h>
#include <iostream>
#include "view.h"
#include "debug.h"

#define STB_IMAGE_IMPLEMENTATION
#include "stb/stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb/stb_image_write.h"

#define JTK_FILE_UTILS_IMPLEMENTATION
#include "jtk/file_utils.h"

int main(int argc, char** argv)
  {
  init_debug();
  SDL_LogSetPriority(SDL_LOG_CATEGORY_APPLICATION, SDL_LOG_PRIORITY_VERBOSE);

  if (SDL_Init(SDL_INIT_EVERYTHING) == -1)
    {
    SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Initilizated SDL Failed: %s", SDL_GetError());
    return -1;
    }
  {
    view my_view(argc, argv);
    my_view.loop();
  }
  SDL_Quit();
  close_debug();
  return 0;
  }
