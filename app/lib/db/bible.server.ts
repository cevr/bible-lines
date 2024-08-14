import { sql } from 'drizzle-orm';
import { Context, Effect, Layer } from 'effect';

import { BibleBookNameToNumberMap } from '../bible';
import type { BibleVersion } from '../bible';
import { DatabaseClient } from './db-client.server';
import { DatabaseError } from './errors.server';
import { verses } from './schema.server';

export interface Verse {
  id: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
  version: BibleVersion;
}

const makeBibleVerseId = (book: number, chapter: number, verse: number) =>
  `${book}:${chapter}:${verse}`;

const make = Effect.gen(function* () {
  const db = yield* DatabaseClient;
  return {
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
                  id: makeBibleVerseId(book, chapter, verse),
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
              // columns: {
              //   embedding: false,
              // },
              where: (verses, { eq, and }) =>
                and(
                  eq(verses.version, version),
                  eq(verses.id, makeBibleVerseId(book, chapter, verse)),
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
        _version: BibleVersion,
        _book: number,
        _chapter: number,
        _verse: number,
        _embedding: Float32Array,
      ) =>
        Effect.tryPromise({
          try: async () => {
            // await db
            //   .update(verses)
            //   .set({ embedding: embedding.buffer })
            //   .where(
            //     and(
            //       eq(verses.id, makeBibleVerseId(book, chapter, verse)),
            //       eq(verses.version, version),
            //     ),
            //   );
          },
          catch: (error) => {
            return new DatabaseError({
              message: `Failed to update verse embedding`,
              cause: error,
            });
          },
        }).pipe(
          Effect.retry({
            times: 3,
          }),
          Effect.withSpan('updateVerseEmbedding'),
        ),

      semanticSearch: (version: BibleVersion, embedding: Float32Array, k = 5) =>
        Effect.gen(function* () {
          return yield* Effect.tryPromise({
            try: async () => {
              const query = sql`SELECT id, book, chapter, verse, text, version FROM verses WHERE rowid IN vector_top_k('verses_embedding_idx', vector(${embedding.buffer}), cast(${k} as int));`;
              return (await db.all(query)) as Verse[];
            },
            catch: (error) => {
              return new DatabaseError({
                message: `Failed to search for verse in version ${version}`,
                cause: error,
              });
            },
          }).pipe(
            Effect.retry({
              times: 3,
            }),
            Effect.withSpan('semanticVerseSearch'),
          );
        }),
      fullTextSearch: (version: BibleVersion, query: string, limit = 5) =>
        Effect.gen(function* () {
          return yield* Effect.tryPromise({
            try: async () => {
              return await db.query.verses.findMany({
                limit,
                where: (verses, { and, eq }) =>
                  and(eq(verses.version, version), sql`text MATCH ${query}`),
              });
            },
            catch: (error) => {
              return new DatabaseError({
                message: `Failed to search for verse in version ${version}`,
                cause: error,
              });
            },
          }).pipe(
            Effect.retry({
              times: 3,
            }),
            Effect.withSpan('fullTextVerseSearch'),
          );
        }),
      fuzzySearch: (version: BibleVersion, query: string, limit = 5) =>
        Effect.gen(function* () {
          return yield* Effect.tryPromise({
            try: async () => {
              return await db.query.verses.findMany({
                limit,
                where: (verses, { and, eq }) =>
                  and(
                    eq(verses.version, version),
                    sql`fuzzy_damlev(text, ${query}) < 3`,
                  ),
              });
            },
            catch: (error) => {
              return new DatabaseError({
                message: `Failed to search for verse in version ${version}`,
                cause: error,
              });
            },
          }).pipe(
            Effect.retry({
              times: 3,
            }),
            Effect.withSpan('fuzzyVerseSearch'),
          );
        }),
    },
    book: {
      get: (version: BibleVersion, book: number) =>
        Effect.tryPromise({
          try: async () => {
            return await db.query.verses.findMany({
              // columns: {
              //   embedding: false,
              // },
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
                  // columns: {
                  //   embedding: false,
                  // },
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
              // columns: {
              //   embedding: false,
              // },
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
  };
});

export class BibleDatabase extends Context.Tag('BibleDatabase')<
  BibleDatabase,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make);
}
