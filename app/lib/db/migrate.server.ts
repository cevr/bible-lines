import path from 'node:path';

import { migrate } from 'drizzle-orm/libsql/migrator';
import { Console, Data, Effect } from 'effect';

import { DatabaseLayer } from '../app-layer.server';
import { DatabaseClient } from './db-client.server';

export class MigrationError extends Data.TaggedError('MigrationError')<{
	message: string;
	cause: unknown;
}> {}

const main = Effect.gen(function* () {
	let client = yield* DatabaseClient;
	yield* Effect.tryPromise({
		try: async () => {
			await migrate(client, {
				migrationsFolder: path.join(process.cwd(), 'app/lib/db/migrations'),
			});
		},
		catch: (error) => {
			return new MigrationError({
				message: 'Failed to migrate database',
				cause: error,
			});
		},
	});
	yield* Console.log('Database migrated');
});

void Effect.runPromise(Effect.provide(main, DatabaseLayer));
