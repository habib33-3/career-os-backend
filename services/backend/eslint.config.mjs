import eslintPluginNestTyped from "@darraghor/eslint-plugin-nestjs-typed";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginN from "eslint-plugin-n";
import eslintPluginPerfectionist from "eslint-plugin-perfectionist";
import eslintPluginSecurity from "eslint-plugin-security";
import eslintPluginSonarjs from "eslint-plugin-sonarjs";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// Ignore patterns
const ignorePatterns = {
    ignores: [
        "**/dist/**",
        "**/node_modules/**",
        "**/coverage/**",
        "**/public/**",
        "./src/generated/**",
        "scripts/**",
        "test/**",
    ],
};

// Base configs
const baseConfigs = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
];

// TypeScript rules
const typescriptRules = {
    files: ["**/*.ts"],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            ecmaVersion: "latest",
            project: ["./tsconfig.eslint.json"],
            sourceType: "module",
        },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": [
            "error",
            { checksVoidReturn: false },
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                args: "after-used",
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                ignoreRestSiblings: true,
                varsIgnorePattern: "^_",
            },
        ],
        "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
};

// Node rules
const nodeRules = {
    files: ["**/*.ts"],
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.es2021,
        },
    },
    plugins: { n: eslintPluginN },
    rules: {
        "n/no-missing-require": "off",
        "n/prefer-node-protocol": "error",
    },
};

// Import rules
const importRules = {
    plugins: { import: eslintPluginImport },
    rules: {
        // Dependency correctness
        "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: true },
        ],

        // Path resolution correctness
        "import/no-unresolved": "error",

        // ❌ Disable ordering — Prettier owns this
        "import/order": "off",
    },
    settings: {
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: "./tsconfig.json",
            },
        },
    },
};

// Unicorn / naming rules
const unicornRules = {
    plugins: { unicorn: eslintPluginUnicorn },
    rules: {
        "unicorn/filename-case": [
            "error",
            {
                cases: { kebabCase: true, pascalCase: true },
                ignore: ["^[A-Za-z0-9]+\\.[A-Za-z0-9]+$"],
            },
        ],
        "unicorn/prefer-module": "off",
    },
};

// Security rules
const securityRules = {
    plugins: { security: eslintPluginSecurity },
    rules: {
        "security/detect-child-process": "error",
        "security/detect-eval-with-expression": "error",
        "security/detect-new-buffer": "error",
    },
};

// SonarJS rules
const sonarjsRules = {
    plugins: { sonarjs: eslintPluginSonarjs },
    rules: {
        "sonarjs/no-duplicate-string": "warn",
        "sonarjs/no-identical-conditions": "error",
    },
};

// Perfectionist rules (object sorting)
const perfectionistRules = {
    plugins: { perfectionist: eslintPluginPerfectionist },
    rules: {
        "perfectionist/sort-objects": [
            "warn",
            { order: "asc", type: "natural" },
        ],
    },
};

// Common JS best practices
const commonJsBestPractices = {
    rules: {
        "eqeqeq": ["error", "always"],
        // "no-console": "error",
        "no-var": "error",
        "object-shorthand": ["error", "always"],
        "prefer-const": "error",
        "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    },
};

// NestJS Typed plugin rules
const nestTypedConfig = {
    plugins: { "@darraghor/nestjs-typed": eslintPluginNestTyped },
    rules: {
        "@darraghor/nestjs-typed/api-methods-should-be-guarded": "off",
    },
};

// ✅ Final ESLint flat config
export default defineConfig([
    ignorePatterns,
    {
        files: ["**/*.js"],
        ...tseslint.configs.disableTypeChecked[0],
    },
    ...baseConfigs,
    typescriptRules,
    nodeRules,
    importRules,
    unicornRules,
    securityRules,
    sonarjsRules,
    perfectionistRules,
    commonJsBestPractices,
    nestTypedConfig,
    prettier,
]);
