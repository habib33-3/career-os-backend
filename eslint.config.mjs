import { fileURLToPath } from "url";
import { dirname } from "path";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["services/**", "node_modules/**", "dist/**"],
  },
  {
    files: ["*.{mjs,js,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
  }
);
