import { and, eq, sql } from 'drizzle-orm';
import { Context, Data, Effect, Layer } from 'effect';

import { BibleBookNameToNumberMap } from '../bible';
import type { BibleVersion } from '../bible';
import { OpenAI } from '../openai';
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
	const openai = yield* OpenAI;

	return {
		client: db,
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
								await db
									.insert(verses)
									.values({
										id: makeId(book, chapter, verse),
										book,
										chapter,
										verse,
										text,
										version,
									})
									.onConflictDoNothing();
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
							return await db.query.verses.findFirst({
								columns: {
									embedding: false,
								},
								where: (verses, { eq, and }) =>
									and(
										eq(verses.version, version),
										eq(verses.id, makeId(book, chapter, verse)),
									),
							});
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
				updateEmbedding: (
					version: BibleVersion,
					book: number,
					chapter: number,
					verse: number,
					embedding: ArrayBuffer,
				) =>
					Effect.tryPromise({
						try: async () => {
							await db
								.update(verses)
								.set({ embedding })
								.where(
									and(
										eq(verses.id, makeId(book, chapter, verse)),
										eq(verses.version, version),
									),
								);
						},
						catch: (error) => {
							return new DatabaseError({
								message: `Failed to update verse embedding`,
								cause: error,
							});
						},
					}).pipe(Effect.withSpan('updateVerseEmbedding')),

				semanticSearch: (version: BibleVersion, query: string, k = 5) =>
					Effect.gen(function* () {
						const result = yield* openai.embed(query);

						return yield* Effect.tryPromise({
							try: async () => {
								return await db.query.verses.findMany({
									columns: {
										embedding: false,
									},
									where: (verses, { eq }) => eq(verses.version, version),
									orderBy: sql`vector_distance_cos(embedding, vector(${new Float32Array(result.embedding).buffer}))`,
									limit: k,
								});
							},
							catch: (error) => {
								return new DatabaseError({
									message: `Failed to search for verse in version ${version} with query ${query}`,
									cause: error,
								});
							},
						}).pipe(Effect.withSpan('semanticVerseSearch'));
					}),
			},
			book: {
				get: (version: BibleVersion, book: number) =>
					Effect.tryPromise({
						try: async () => {
							return await db.query.verses.findMany({
								columns: {
									embedding: false,
								},
								where: (verses, { eq, and }) =>
									and(eq(verses.version, version), eq(verses.book, book)),
								orderBy: (verses, { asc }) => [
									asc(verses.chapter),
									asc(verses.verse),
								],
							});
						},
						catch: (error) => {
							return new DatabaseError({
								message: `Failed to get version ${version} book ${book}`,
								cause: error,
							});
						},
					}).pipe(Effect.withSpan('getBook')),
				all: (version: BibleVersion) =>
					Effect.all(
						Object.values(BibleBookNameToNumberMap).map((book) =>
							Effect.tryPromise({
								try: async () => {
									return await db.query.verses.findMany({
										columns: {
											embedding: false,
										},
										where: (verses, { eq, and }) =>
											and(eq(verses.version, version), eq(verses.book, book)),
										orderBy: (verses, { asc }) => [
											asc(verses.chapter),
											asc(verses.verse),
										],
									});
								},
								catch: (error) => {
									return new DatabaseError({
										message: `Failed to get version ${version} `,
										cause: error,
									});
								},
							}),
						),
					).pipe(Effect.withSpan('getAllBooks')),
			},
			chapter: {
				get: (version: BibleVersion, book: number, chapter: number) =>
					Effect.tryPromise({
						try: async () => {
							return await db.query.verses.findMany({
								columns: {
									embedding: false,
								},
								where: (verses, { eq, and }) =>
									and(
										eq(verses.version, version),
										eq(verses.book, book),
										eq(verses.chapter, chapter),
									),
								orderBy: (verses, { asc }) => asc(verses.verse),
							});
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
