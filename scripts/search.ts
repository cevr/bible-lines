import { Effect } from 'effect';

import { AppLayerLive } from '~/app/lib/app-layer.server';
import { BibleBookNumberToNameMap, BibleVersion } from '~/app/lib/bible';
import { Database } from '~/app/lib/db/db.server';

const main = Effect.gen(function* () {
  const database = yield* Database;

  const verses = yield* database.bible.verse.fullTextSearch(
    BibleVersion.KJV,
    'not with the blood of goats and calves, but with his own blood',
  );
  yield* Effect.log(
    verses
      .map(
        (verse) =>
          `${BibleBookNumberToNameMap[verse.book]} ${verse.chapter}:${verse.verse} ${verse.text}`,
      )
      .join('\n'),
  );
});

void Effect.runPromise(Effect.provide(main, AppLayerLive));
