import 'dotenv/config';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

import { Env } from '../env.server';
import * as schema from './schema.server';

async function main() {
	const client = createClient({
		url: Env.DB_URL,
		authToken: Env.DB_AUTH_TOKEN,
	});

	const db = drizzle(client, { schema });

	await migrate(db, { migrationsFolder: 'app/db/migrations' });

	console.log('🌿 Seeding database');

	await db
		.insert(schema.countries)
		.values({
			id: 1,
			name: 'USA',
		})
		.onConflictDoNothing();

	await db
		.insert(schema.countries)
		.values({
			id: 2,
			name: 'Kyrgyzstan',
		})
		.onConflictDoNothing();

	await db
		.insert(schema.users)
		.values({
			id: 1,
			email: 'hello@cvr.im',
			password: '!StrongPassword01',
		})
		.onConflictDoNothing();
}

void main();
