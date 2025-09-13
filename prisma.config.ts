import { defineConfig } from '@prisma/config';

export default defineConfig({
  seed: 'node dist/prisma/seed.js',
});
