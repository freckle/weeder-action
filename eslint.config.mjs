// @ts-check

import eslint from "@eslint/js";
import jest from "eslint-plugin-jest";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/", "**/*.js"],
  },
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    files: ["__tests__/**/*.test.ts"],
    ...jest.configs["flat/recommended"],
  },
);
