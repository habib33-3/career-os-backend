/** @type {import("prettier").Config} */
export default {
  semi: true,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  singleAttributePerLine: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-packagejson",
  ],

  tailwindStylesheet: "./src/app/globals.css",

  tailwindFunctions: ["clsx", "twMerge", "cn", "cva"],

  importOrder: [
    "^react$",
    "^next",

    "<THIRD_PARTY_MODULES>",

    "^@/components/(.*)$",
    "^@/features/(.*)$",
    "^@/shared/(.*)$",
    "^@/(.*)$",

    "^[./]",
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
