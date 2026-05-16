/** @type {import('prettier').Config} */
export default {
    arrowParens: "always",
    bracketSameLine: false,
    bracketSpacing: true,
    endOfLine: "lf",
    // Meaningful Import Sorting for NestJS
    importOrder: [
        // Node.js built-ins
        "^node:(.*)$",
        "^(fs|path|os|http|https|crypto|util|stream)(/.*)?$",

        // External libraries
        "^@nestjs/(.*)$",
        "^express$",
        "^express-(.*)$",
        "<THIRD_PARTY_MODULES>",

        // Global configuration and utilities
        "^@/config/(.*)$",
        "^@/lib/(.*)$",
        "^@/utils/(.*)$",
        "^@/types/(.*)$",
        "^@/shared/(.*)$",
        "^@/errors/(.*)$",

        // Core NestJS application structure
        "^@/common/(.*)$",
        "^@/middlewares/(.*)$",
        "^@/modules/(.*)/controllers/(.*)$",
        "^@/modules/(.*)/services/(.*)$",
        "^@/modules/(.*)/dto/(.*)$",
        "^@/modules/(.*)/entities/(.*)$",
        "^@/modules/(.*)/repositories/(.*)$",
        "^@/modules/(.*)/guards/(.*)$",
        "^@/modules/(.*)/pipes/(.*)$",

        // Application-specific modules
        "^@/modules/(.*)$",
        "^@/(.*)$",

        // Relative imports
        "^[./]",
    ],
    importOrderCaseInsensitive: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    overrides: [
        {
            files: "*.prisma",
            options: {
                parser: "prisma",
                printWidth: 120,
                tabWidth: 4,
            },
        },
        {
            files: "*.sql",
            options: {
                identifierCase: "lower",
                keywordCase: "upper",
                parser: "sql",
            },
        },
        {
            files: ["*.json", "*.jsonc"],
            options: {
                parser: "json",
                tabWidth: 2,
            },
        },
        {
            files: "*.yml",
            options: {
                parser: "yaml",
                tabWidth: 2,
            },
        },
    ],

    plugins: [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-packagejson",
    ],
    printWidth: 80,
    quoteProps: "consistent",
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "es5",
};
