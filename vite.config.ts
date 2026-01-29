import { defineConfig } from "vite";
import path from 'path';

export default defineConfig(({ command }) => {
  const config = {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: ['legacy-js-api'],
          additionalData: `@use '/src/styles/_colors.scss'; @use '/src/styles/_constants.scss'; @use '/src/styles/_globals.scss';`,
        },
      },
    },
  };

  if (command === 'build') {
    return {
      ...config,
      base: '/dist/'
    };
  } else {
    return {
      ...config,
      base: '/'
    };
  }

});