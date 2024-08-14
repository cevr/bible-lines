import { Context, Effect, Layer } from 'effect';

import { BibleDatabase } from './bible.server';
import { DatabaseClient } from './db-client.server';
import { EGWDatabase } from './egw.server';

const make = Effect.gen(function* () {
  const db = yield* DatabaseClient;
  const bible = yield* BibleDatabase;
  const egw = yield* EGWDatabase;

  return {
    client: db,
    bible,
    egw,
  };
});

export class Database extends Context.Tag('Database')<
  Database,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make).pipe(
    Layer.provide(Layer.mergeAll(BibleDatabase.Live, EGWDatabase.Live)),
  );
}
