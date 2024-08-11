import type { Config } from 'drizzle-kit';

import { Env } from './app/lib/env.server';

const env = Env.sync();

export default {
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: env.DB_URL,
    authToken: env.DB_AUTH_TOKEN,
  },
  schema: './app/lib/db/schema.server.ts',
  out: './app/lib/db/migrations',
} satisfies Config;
