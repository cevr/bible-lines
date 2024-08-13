import { sql } from 'drizzle-orm';
import { Context, Data, Effect, Layer } from 'effect';

import { BibleBookNameToNumberMap } from '../bible';
import type { BibleVersion } from '../bible';
import { DatabaseClient } from './db-client.server';
import { egw, verses } from './schema.server';

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

interface EGW {
  id: string;
  refcode: string;
  text: string;
}

const makeBibleVerseId = (book: number, chapter: number, verse: number) =>
  `${book}:${chapter}:${verse}`;

// this is a utility function to clean up refcodes
// eg. '1T 222.1' -> '1t222.1'
const cleanRefcode = (refcode: string) =>
  refcode.replace(/[\s-]/g, '').toLowerCase();

const make = Effect.gen(function* () {
  const db = yield* DatabaseClient;

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

        semanticSearch: (
          version: BibleVersion,
          embedding: Float32Array,
          k = 5,
        ) =>
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
    },
    egw: {
      add: (
        book: string,
        key: number,
        refcode_short: string,
        refcode_long: string,
        content: string,
        // embedding?: Float32Array,
      ) =>
        Effect.tryPromise({
          try: async () => {
            await db
              .insert(egw)
              .values({
                book,
                id: cleanRefcode(refcode_short),
                key,
                refcode: refcode_long,
                text: content,
                // embedding: embedding?.buffer,
              })
              .onConflictDoNothing();
          },
          catch: (error) => {
            return new DatabaseError({
              message: `Failed to add EGW`,
              cause: error,
            });
          },
        }).pipe(Effect.withSpan('addEGW')),
      addMany: (
        passages: {
          book: string;
          key: number;
          refcode_short: string;
          refcode_long: string;
          content: string;
          embedding?: Float32Array;
        }[],
      ) =>
        Effect.tryPromise({
          try: async () => {
            await db.batch(
              passages.map((passage) =>
                db
                  .insert(egw)
                  .values({
                    book: passage.book,
                    id: cleanRefcode(passage.refcode_short),
                    key: passage.key,
                    refcode: passage.refcode_long,
                    text: passage.content,
                    // embedding: passage.embedding?.buffer,
                  })
                  .onConflictDoNothing(),
              ) as any,
            );
          },
          catch: (error) => {
            return new DatabaseError({
              message: `Failed to add EGW`,
              cause: error,
            });
          },
        }).pipe(
          Effect.retry({
            times: 3,
          }),
          Effect.withSpan('addManyEGW'),
        ),
      get: (refcode_short: string) =>
        Effect.tryPromise({
          try: async () => {
            return await db.query.egw.findFirst({
              // columns: {
              //   embedding: false,
              // },
              where: (egw, { eq }) => eq(egw.id, cleanRefcode(refcode_short)),
            });
          },
          catch: (error) => {
            return new DatabaseError({
              message: `Failed to get EGW`,
              cause: error,
            });
          },
        }).pipe(Effect.withSpan('getEGW')),
      // updateEmbedding: (refcode_short: string, embedding: Float32Array) =>
      //   Effect.tryPromise({
      //     try: async () => {
      //       await db
      //         .update(egw)
      //         .set({ embedding: embedding.buffer })
      //         .where(eq(egw.id, cleanRefcode(refcode_short)));
      //     },
      //     catch: (error) => {
      //       return new DatabaseError({
      //         message: `Failed to update EGW embedding`,
      //         cause: error,
      //       });
      //     },
      //   }).pipe(
      //     Effect.retry({
      //       times: 3,
      //     }),
      //     Effect.withSpan('updateEGWEmbedding'),
      //   ),
      semanticSearch: (embedding: Float32Array, k = 5) =>
        Effect.gen(function* () {
          // const result = yield* openai.embed(query);
          // const embedding = new Float32Array(result.embedding).buffer;

          return yield* Effect.tryPromise({
            try: async () => {
              const query = sql`SELECT id, refcode, text FROM egw WHERE rowid IN vector_top_k('egw_embedding_idx', vector(${embedding.buffer}), cast(${k} as int));`;
              return (await db.all(query)) as EGW[];
            },
            catch: (error) => {
              return new DatabaseError({
                message: `Failed to search for EGW with embedding`,
                cause: error,
              });
            },
          }).pipe(Effect.withSpan('semanticEGWSearch'));
        }),
    },
  };
});

export class Database extends Context.Tag('Database')<
  Database,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make);
}
