import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    sourcemap: true,
    exports: "auto",
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        module: "ESNext",
        moduleResolution: "bundler",
      },
    }),
    resolve({
      preferBuiltins: true,
      exportConditions: ["node"],
    }),
    commonjs(),
  ],
  external: [
    "fs",
    "path",
    "os",
    "crypto",
    "util",
    "stream",
    "events",
    "http",
    "https",
    "url",
    "zlib",
    "string_decoder",
    "buffer",
  ],
};
