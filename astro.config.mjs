// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  output: "server",

  env: {
    schema: {
      QUIZ_API_KEY: envField.string({
        context: "server",
        access: "secret"
      }),
      MISTRAL_API_KEY: envField.string({
        context: "server",
        access: "secret"
      }),
    }
  },

  adapter: vercel(),
});