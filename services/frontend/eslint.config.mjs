import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import tailwindPlugin from "eslint-plugin-better-tailwindcss";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  // -------------------------
  // Ignore
  // -------------------------
  {
    ignores: [
      ".next/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "**/*.mjs",
    ],
  },

  // -------------------------
  // Base configs
  // -------------------------
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // -------------------------
  // App config
  // -------------------------
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
      "better-tailwindcss": tailwindPlugin,
      unicorn,
    },

    settings: {
      "import/resolver": {
        typescript: true,
      },
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
      },
    },

    rules: {
      // -------------------------
      // Next.js (correct usage)
      // -------------------------
      ...nextPlugin.configs["core-web-vitals"].rules,

      // -------------------------
      // React Hooks
      // -------------------------
      ...reactHooks.configs.recommended.rules,

      // -------------------------
      // Accessibility
      // -------------------------
      ...jsxA11y.configs.recommended.rules,

      // -------------------------
      // TypeScript safety (minimal but important)
      // -------------------------
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // -------------------------
      // Imports safety (RESTORED)
      // -------------------------
      "import/no-duplicates": "warn",
      "import/no-unresolved": "error",

      // -------------------------
      // Unicorn (safe subset only)
      // -------------------------
      "unicorn/filename-case": [
        "off",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",

      // -------------------------
      // Tailwind safety (keep value rules ON)
      // -------------------------
      "better-tailwindcss/enforce-consistent-variable-syntax": "warn",
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",
      "better-tailwindcss/no-unknown-classes": "warn",
      "better-tailwindcss/no-unnecessary-whitespace": "warn",

      // -------------------------
      // General JS quality
      // -------------------------
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "object-shorthand": ["warn", "always"],
    },
  },

  // -------------------------
  // Prettier (must be last)
  // -------------------------
  prettier
);
