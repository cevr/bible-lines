import type { Config } from 'drizzle-kit';

import { Env } from './app/lib/env.server';

export default {
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: Env.DB_URL,
		authToken: Env.DB_AUTH_TOKEN,
	},
	schema: './app/lib/db/schema.server.ts',
	out: './app/lib/db/migrations',
} satisfies Config;
