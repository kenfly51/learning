import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV || "development"
    ), // Replacing with a string
    "process.env": {}, // Prevents unwanted references
  },
  build: {
    minify: false,
    lib: {
      entry: "./src/component.jsx",
      name: "ReactMicroFrontend",
      fileName: () => `micro-frontend-react.js`,
      formats: ["es"], // Ensure it outputs in ES Module format
    },
    rollupOptions: {
      output: {
        // Ensure the module can be used as an external script
        inlineDynamicImports: true,
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      scopeBehaviour: "local",
    },
  },
});
