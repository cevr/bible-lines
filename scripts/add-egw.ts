import * as nodeFs from 'node:fs';

import * as Platform from '@effect/platform';
import * as Node from '@effect/platform-node';
import { Chunk, Effect, Layer, Logger, Ref, Stream } from 'effect';
import StreamArray from 'stream-json/streamers/StreamArray.js';

import { OpenAI } from '~/app/lib/openai';

import { AppLayerLive } from '../app/lib/app-layer.server';
import { Database } from '../app/lib/db/db.server';

interface EGW {
  refcode_short: string;
  refcode_long: string;
  content: string;
}

interface Parsed<T> {
  key: number;
  value: T;
}

export class Counter {
  inc: Effect.Effect<void>;
  dec: Effect.Effect<void>;
  get: Effect.Effect<number>;

  constructor(private value: Ref.Ref<number>) {
    this.inc = Ref.update(this.value, (n) => n + 1);
    this.dec = Ref.update(this.value, (n) => n - 1);
    this.get = Ref.get(this.value);
  }
  static make = Ref.make(0).pipe(Effect.map((value) => new Counter(value)));
}

const main = Effect.gen(function* () {
  const openai = yield* OpenAI;
  const database = yield* Database;
  const fs = yield* Platform.FileSystem.FileSystem;
  const path = yield* Platform.Path.Path;
  const dir = yield* fs.readDirectory(path.join(process.cwd(), 'assets/egw'));
  const files = dir
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(process.cwd(), 'assets/egw', file));
  const total = files.length;
  const count = yield* Counter.make;

  yield* Effect.log(`Adding ${total} EGW files`);

  const ops = files.map((file) =>
    Effect.gen(function* () {
      const book = path.basename(file, '.json');
      const stream = Node.NodeStream.fromReadable<Error, Parsed<EGW>>(
        () => nodeFs.createReadStream(file).pipe(StreamArray.withParser()),
        (cause) =>
          new Error('Failed to read file', {
            cause,
          }),
      ).pipe(
        Stream.grouped(1000),
        Stream.map((chunks) =>
          Chunk.filter(chunks, (chunk) => chunk.value.content.length > 0),
        ),
      );
      yield* Stream.runForEach(stream, (passages) =>
        Effect.gen(function* () {
          const embeddings = Chunk.fromIterable(
            yield* openai.embedMany(
              Chunk.toArray(
                passages.pipe(Chunk.map((passage) => passage.value.content)),
              ),
            ),
          );
          const embeddingsAndPassages = Chunk.zipWith(
            passages,
            embeddings,
            (a, b) => [b as Float32Array | undefined, a] as const,
          );
          yield* database.egw.addMany(
            Chunk.toArray(
              Chunk.map(
                embeddingsAndPassages,
                ([embedding, passage]) =>
                  ({
                    book,
                    key: passage.key,
                    refcode_short: passage.value.refcode_short,
                    refcode_long: passage.value.refcode_long,
                    content: passage.value.content,
                    embedding,
                  }) as const,
              ),
            ),
          );
          yield* Effect.log(`Embedded ${passages.length} passages for ${book}`);
        }),
      );

      yield* count.inc;
      yield* Effect.log(`Added ${book}. ${yield* count.get}/${total}`);
    }),
  );
  yield* Effect.all(ops, {
    concurrency: 1,
  });
}).pipe(
  Effect.catchAll((error) =>
    Effect.logError(error).pipe(
      Effect.map(() => Effect.die(new Error('Failed to add egw'))),
    ),
  ),
);

void Effect.runPromise(
  Effect.provide(
    main,
    AppLayerLive.pipe(
      Layer.provideMerge(Node.NodeFileSystem.layer),
      Layer.provideMerge(Node.NodePath.layer),
      Layer.provideMerge(Logger.pretty),
    ),
  ),
);
