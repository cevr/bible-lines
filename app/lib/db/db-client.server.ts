import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { Context, Data, Effect, Layer } from 'effect';

import { Env } from '../env.server';
import * as schema from './schema.server';

export class DbConnectionError extends Data.TaggedError(
	'DbConnectionError' as const,
)<{
	message: string;
	cause: unknown;
}> {}

const make = Effect.gen(function* () {
	const env = yield* Env;

	return yield* Effect.try({
		try: () => {
			const client = createClient({
				url: env.DB_URL,
				authToken: env.DB_AUTH_TOKEN,
				concurrency: 50,
			});
			const db = drizzle(client, { schema: schema });
			return db;
		},
		catch: (error) =>
			new DbConnectionError({
				message: `Failed to connect to database`,
				cause: error,
			}),
	});
});

export class DatabaseClient extends Context.Tag('DatabaseClient')<
	DatabaseClient,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(DatabaseClient, make);
}
