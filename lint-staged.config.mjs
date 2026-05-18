// Root lint-staged.config.mjs - EXCLUDE services, let them run independently
export default {
  "services/frontend/**": () => "pnpm --filter frontend exec lint-staged",
  "services/backend/**": () =>
    "pnpm --filter nestjs-prisma-scaffold exec lint-staged",
  // Only apply root rules to ROOT-LEVEL files, NOT services
  "*.{js,ts,mjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
};
