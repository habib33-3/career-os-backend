export default {
  'services/frontend/**': () => 'pnpm --filter frontend exec lint-staged',
  'services/backend/**': () =>
    'pnpm --filter nestjs-prisma-scaffold exec lint-staged',
  '*.{js,ts,mjs}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
