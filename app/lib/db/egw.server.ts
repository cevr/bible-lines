import { sql } from 'drizzle-orm';
import { Context, Effect, Layer } from 'effect';

import { DatabaseClient } from './db-client.server';
import { DatabaseError } from './errors.server';
import { egw } from './schema.server';

interface EGW {
  id: string;
  refcode: string;
  text: string;
}

// this is a utility function to clean up refcodes
// eg. '1T 222.1' -> '1t222.1'
const cleanRefcode = (refcode: string) =>
  refcode.replace(/[\s-]/g, '').toLowerCase();

export const make = Effect.gen(function* () {
  const db = yield* DatabaseClient;
  return {
    add: (
      book: string,
      key: number,
      refcode_short: string,
      refcode_long: string,
      content: string,
      _embedding?: Float32Array,
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
  };
});

export class EGWDatabase extends Context.Tag('EGWDatabase')<
  EGWDatabase,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make);
}
