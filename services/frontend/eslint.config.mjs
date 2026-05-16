import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import tailwindPlugin from "eslint-plugin-better-tailwindcss";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // --------------------------------------------------
  // Ignore
  // --------------------------------------------------
  {
    ignores: [
      ".next/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "public/**",
      "**/*.mjs",
    ],
  },

  // --------------------------------------------------
  // Base JS + TS
  // --------------------------------------------------
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // --------------------------------------------------
  // App-level config
  // --------------------------------------------------
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      perfectionist,
      "react-hooks": reactHooks,
      sonarjs,
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
      // --------------------------------------------------
      // Next.js (core web vitals)
      // --------------------------------------------------
      ...nextPlugin.configs["core-web-vitals"].rules,

      // --------------------------------------------------
      // React Hooks
      // --------------------------------------------------
      ...reactHooks.configs.recommended.rules,

      // --------------------------------------------------
      // Accessibility
      // --------------------------------------------------
      ...jsxA11y.configs.recommended.rules,

      // --------------------------------------------------
      // TypeScript (practical rules only)
      // --------------------------------------------------
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/require-await": "off",

      // --------------------------------------------------
      // Imports
      // --------------------------------------------------
      "import/no-duplicates": "warn",
      "import/no-unresolved": "off",

      // --------------------------------------------------
      // Unicorn (useful subset only)
      // --------------------------------------------------
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["^README.md$"],
        },
      ],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",

      // --------------------------------------------------
      // SonarJS (reduce noise)
      // --------------------------------------------------
      "sonarjs/no-duplicate-string": "off",

      // --------------------------------------------------
      // Tailwind (FIXED plugin rules)
      // --------------------------------------------------
      "better-tailwindcss/enforce-consistent-variable-syntax": "warn",
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",
      "better-tailwindcss/no-unregistered-classes": "off",
      "better-tailwindcss/no-unnecessary-whitespace": "warn",

      // --------------------------------------------------
      // Perfectionist (imports sorting)
      // --------------------------------------------------
      "perfectionist/sort-imports": [
        "warn",
        {
          type: "natural",
          order: "asc",
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
        },
      ],

      // --------------------------------------------------
      // General JS best practices
      // --------------------------------------------------
      eqeqeq: ["error", "always"],

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "prefer-const": "warn",

      "object-shorthand": ["warn", "always"],
    },
  },

  // --------------------------------------------------
  // Prettier (must be last)
  // --------------------------------------------------
  prettier
);
