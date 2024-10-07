import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV || "development"
    ), // Replacing with a string
    "process.env": {}, // Prevents unwanted references
  },
  build: {
    lib: {
      entry: "./src/main.js",
      name: "VueMicroFrontend",
      fileName: (format) => `micro-frontend-vue.js`,
      formats: ["es"], // Ensure it outputs in ES Module format
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Ensure dynamic imports are handled in a single file
      },
    },
  },
});
