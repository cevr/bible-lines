import { Console, Effect } from 'effect';

import { AppLayerLive } from '~/app/lib/app-layer.server';
import { BibleBookNumberToNameMap, BibleVersion } from '~/app/lib/bible';
import { Database } from '~/app/lib/db/db.server';
import { OpenAI } from '~/app/lib/openai';

const main = Effect.gen(function* () {
	const openai = yield* OpenAI;
	const database = yield* Database;
	const books = yield* database.bible.book.all(BibleVersion.KJV);
	let total = books.length;
	let count = 0;
	yield* Console.log(`Embedding ${total} books`);
	yield* Effect.all(
		books.map((verses) =>
			openai.embedMany(verses.map((verse) => verse.text)).pipe(
				Effect.tap(
					Console.log(
						`Retrieved ${verses.length} embeddings for book ${BibleBookNumberToNameMap[verses[0]?.book as any]}`,
					),
				),
				Effect.flatMap((results) => {
					let total = results.embeddings.length;
					let count = 0;
					return Effect.all(
						results.embeddings.map((embedding, index) => {
							const verse = verses[index]!;
							return database.bible.verse
								.updateEmbedding(
									BibleVersion.KJV,
									verse.book,
									verse.chapter,
									verse.verse,
									new Float32Array(embedding),
								)
								.pipe(
									Effect.tap(
										Console.log(
											`Embedded ${++count} of ${total} verses in book`,
										),
									),
									Effect.tapError((error) => {
										return Console.error(error);
									}),
									Effect.orDie,
								);
						}),
						{
							concurrency: 250,
						},
					).pipe(Effect.orDie);
				}),
				Effect.tap(Console.log(`Embedded ${++count} of ${total}`)),
			),
		),
		{
			concurrency: 1,
		},
	);
});

Effect.runPromise(Effect.provide(main, AppLayerLive));
