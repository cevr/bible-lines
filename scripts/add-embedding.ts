import { Effect } from 'effect';

import { AppLayerLive } from '~/app/lib/app-layer.server';
import { BibleBookNumberToNameMap, BibleVersion } from '~/app/lib/bible';
import { Database } from '~/app/lib/db/db.server';
import { OpenAI } from '~/app/lib/openai';

const main = Effect.gen(function* () {
  const openai = yield* OpenAI;
  const database = yield* Database;
  const books = yield* database.bible.book.all(BibleVersion.KJV);
  let totalBooks = books.length;
  let bookCount = 0;
  yield* Effect.log(`Embedding ${totalBooks} books`);
  yield* Effect.all(
    books.map((verses) =>
      Effect.gen(function* () {
        const book =
          BibleBookNumberToNameMap[
            verses[0]?.book as keyof typeof BibleBookNumberToNameMap
          ]!;
        const results = yield* openai
          .embedMany(verses.map((verse) => verse.text))
          .pipe(Effect.orDie);
        yield* Effect.log(
          `Retrieved ${verses.length} embeddings for book ${book}`,
        );

        let totalVerses = results.length;
        let versesCount = 0;
        yield* Effect.all(
          results.map((embedding, index) => {
            const verse = verses[index]!;
            return database.bible.verse
              .updateEmbedding(
                BibleVersion.KJV,
                verse.book,
                verse.chapter,
                verse.verse,
                embedding,
              )
              .pipe(
                Effect.tapError((error) => {
                  return Effect.logError(error);
                }),
                Effect.orDie,
                Effect.tap(
                  Effect.log(
                    `Embedded ${++versesCount} of ${totalVerses} verses in book ${book}`,
                  ),
                ),
              );
          }),
          {
            concurrency: 250,
          },
        ).pipe(Effect.orDie);
        yield* Effect.log(`Embedded ${++bookCount} of ${totalBooks}`);
      }),
    ),
    {
      concurrency: 1,
    },
  );
});

void Effect.runPromise(Effect.provide(main, AppLayerLive));
