import { and, eq } from 'drizzle-orm';
import { Context, Data, Effect, Layer } from 'effect';

import type { BibleVersion } from '../bible';
import { DatabaseClient } from './db-client.server';
import { verses } from './schema.server';

export class DatabaseError extends Data.TaggedError('DatabaseError' as const)<{
	message: string;
	cause: unknown;
}> {}

export interface Verse {
	id: string;
	book: number;
	chapter: number;
	verse: number;
	text: string;
	version: BibleVersion;
}

const makeId = (book: number, chapter: number, verse: number) =>
	`${book}:${chapter}:${verse}`;

const make = Effect.gen(function* () {
	const db = yield* DatabaseClient;
	// const openai = yield* OpenAI;

	return {
		bible: {
			verse: {
				add: (
					version: BibleVersion,
					book: number,
					chapter: number,
					verse: number,
					text: string,
				) =>
					Effect.gen(function* () {
						yield* Effect.tryPromise({
							try: async () => {
								await db.insert(verses).values({
									id: makeId(book, chapter, verse),
									book,
									chapter,
									verse,
									text,
									version,
								});
							},
							catch: (error) => {
								return new DatabaseError({
									message: `Failed to add verse. ${JSON.stringify(
										{
											version,
											book,
											chapter,
											verse,
											text,
										},
										null,
										2,
									)}`,
									cause: error,
								});
							},
						}).pipe(Effect.withSpan('addVerse'));
					}),
				get: (
					version: BibleVersion,
					book: number,
					chapter: number,
					verse: number,
				) =>
					Effect.tryPromise({
						try: async () => {
							return await db
								.select({
									id: verses.id,
									book: verses.book,
									chapter: verses.chapter,
									verse: verses.verse,
									text: verses.text,
									version: verses.version,
								})
								.from(verses)
								.where(
									and(
										eq(verses.version, version),
										eq(verses.id, makeId(book, chapter, verse)),
									),
								)
								.get();
						},
						catch: (error) => {
							return new DatabaseError({
								message: `Failed to get version ${version} book ${book} chapter ${chapter} verse ${verse}`,
								cause: error,
							});
						},
					}).pipe(
						Effect.withSpan('getVerse'),
						Effect.flatMap(Effect.fromNullable),
					),

				// semanticSearch: (version, query, k = 5) =>
				// 	Effect.gen(function* () {
				// 		const result = yield* openai.embed(query);

				// 		return yield* Effect.tryPromise({
				// 			try: async () => {
				// 				return (await db.all(sql`
				// 			    SELECT id, book, chapter, verse, text, version
				// 				FROM verses
				// 				WHERE rowid
				// 				IN vector_top_k('verses_embedding_idx', vector('${JSON.stringify(result.embedding)}'), ${k});`)) as Verse[];
				// 			},
				// 			catch: (error) => {
				// 				return new DatabaseError({
				// 					message: `Failed to search for verse in version ${version} with query ${query}`,
				// 					cause: error,
				// 				});
				// 			},
				// 		}).pipe(Effect.withSpan('semanticVerseSearch'));
				// 	}),
			},
			book: {
				get: (version: BibleVersion, book: number) =>
					Effect.tryPromise({
						try: async () => {
							return await db
								.select({
									id: verses.id,
									book: verses.book,
									chapter: verses.chapter,
									verse: verses.verse,
									text: verses.text,
									version: verses.version,
								})
								.from(verses)
								.where(and(eq(verses.version, version), eq(verses.book, book)))
								.orderBy(verses.chapter, verses.verse);
						},
						catch: (error) => {
							return new DatabaseError({
								message: `Failed to get version ${version} book ${book}`,
								cause: error,
							});
						},
					}).pipe(Effect.withSpan('getBook')),
			},
			chapter: {
				get: (version: BibleVersion, book: number, chapter: number) =>
					Effect.tryPromise({
						try: async () => {
							return await db
								.select({
									id: verses.id,
									book: verses.book,
									chapter: verses.chapter,
									verse: verses.verse,
									text: verses.text,
									version: verses.version,
								})
								.from(verses)
								.where(
									and(
										eq(verses.version, version),
										eq(verses.book, book),
										eq(verses.chapter, chapter),
									),
								)
								.orderBy(verses.verse);
						},
						catch: (error) => {
							return new DatabaseError({
								message: `Failed to get version ${version} chapter ${chapter}`,
								cause: error,
							});
						},
					}).pipe(Effect.withSpan('getChapter')),
			},
		},
	};
});

export class Database extends Context.Tag('Database')<
	Database,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(this, make);
}
