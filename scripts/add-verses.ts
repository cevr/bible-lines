import { Console, Effect } from 'effect';

import { AppLayerLive } from '../app/lib/app-layer.server';
import { Database } from '../app/lib/db/db.server';
import kjv from '../assets/kjv.json';

const main = Effect.gen(function* () {
	const db = yield* Database;
	const verses = (
		kjv as {
			verses: {
				book: number;
				chapter: number;
				verse: number;
				text: string;
			}[];
		}
	).verses;
	let total = verses.length;
	let count = 0;
	const ops = verses.map((verse) =>
		db.bible.verse
			.add('kjv', verse.book, verse.chapter, verse.verse, verse.text)
			.pipe(Effect.flatMap(() => Console.log(`${++count}/${total}`))),
	);
	yield* Effect.all(ops, {
		concurrency: 50,
	});
}).pipe(
	Effect.catchAll((error) =>
		Console.error(error).pipe(
			Effect.map(() => Effect.die(new Error('Failed to add verses'))),
		),
	),
);

void Effect.runPromise(Effect.provide(main, AppLayerLive));
