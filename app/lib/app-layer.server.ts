import { Layer } from 'effect';

import { DatabaseClient } from './db/db-client.server';
import { Database } from './db/db.server';
import { Env } from './env.server';

// import { OpenAI } from './openai';

export const DatabaseLayer = DatabaseClient.Live.pipe(
	Layer.provideMerge(Env.Live),
);

export const AppLayerLive = Database.Live.pipe(
	// Layer.provideMerge(OpenAI.Live),
	Layer.provideMerge(DatabaseLayer),
);
