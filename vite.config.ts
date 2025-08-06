/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          GoogleAnalytics: process.env.GoogleAnalytics
        }
      },
    }),
  ],
});
