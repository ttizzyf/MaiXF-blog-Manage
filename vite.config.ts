import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}/`,
      comps: `${path.resolve(__dirname, "src/components")}/`,
      views: `${path.resolve(__dirname, "src/views")}/`,
      store: `${path.resolve(__dirname, "src/store")}/`,
      utils: `${path.resolve(__dirname, "src/utils")}/`,
      libs: `${path.resolve(__dirname, "src/libs")}/`,
      api: `${path.resolve(__dirname, "src/api")}/`,
      styles: `${path.resolve(__dirname, "src/assets/styles")}/`,
    },
  },
  server: {
    proxy: {
      "/w1": {
        target: "http://localhost:4089",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/w1/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          "@import '@/assets/styles/abstracts/variables.scss'; @import '@/assets/styles/abstracts/mixins.scss';",
      },
      less: {
        modifyVars: {
          "@primary-color": "#f54325",
          "@success-color": "#80b178",
          "@warning-color": "#d8c49a",
          "@error-color": "#d1786b",
          "@heading-color": "#333333",
          "@text-color": "#666666",
          "@text-color-secondary": "#999999",
        },
        javascriptEnabled: true,
      },
    },
  },
  optimizeDeps: {
    include: ["@kangc/v-md-editor/lib/theme/vuepress.js"],
  },
});
