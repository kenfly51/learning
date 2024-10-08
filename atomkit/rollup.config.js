import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts", // Entry point
  output: [
    {
      file: "dist/atomkit.cjs.js", // CommonJS format
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/atomkit.esm.js", // ES Module format
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
  external: [], // Add any external dependencies here
};
