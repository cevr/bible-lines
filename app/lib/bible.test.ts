import { it } from '@effect/vitest';
import { Effect } from 'effect';
import { describe, expect } from 'vitest';

import { parseSearch, ParseSearchError } from './bible.server';

describe('parseSearch', () => {
  it.effect('should handle <book> <chapter>:<verse>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('Genesis 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
      });
      expect(yield* parseSearch('Gen 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
      });
      expect(yield* parseSearch('Gen. 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
      });
    }),
  );

  it.effect('should handle <version> <book> <chapter>:<verse>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('kjv Genesis 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('KJV Genesis 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Genesis 1:1 KJV')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Genesis 1:1 kjv')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('kjv Gen 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('KJV Gen 1:1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });

      expect(yield* parseSearch('Gen 1:1 KJV')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Gen 1:1 kjv')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
    }),
  );

  it.effect('should handle <book> <chapter> <verse>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('Genesis 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
      });
      expect(yield* parseSearch('Gen 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
      });
      expect(yield* parseSearch('Gen. 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
      });
    }),
  );

  it.effect('should handle <version> <book> <chapter> <verse>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('kjv Genesis 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('KJV Genesis 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Genesis 1 1 KJV')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Genesis 1 1 kjv')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('kjv Gen 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('KJV Gen 1 1')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });

      expect(yield* parseSearch('Gen 1 1 KJV')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Gen 1 1 kjv')).toEqual({
        type: 'BookChapterVerse',
        book: 1,
        chapter: 1,
        verse: 1,
        version: 'kjv',
      });
    }),
  );

  it.effect('should handle <book> <chapter>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('Genesis 1')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
      });
      expect(yield* parseSearch('Gen 1')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
      });
      expect(yield* parseSearch('Gen. 1')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
      });
    }),
  );

  it.effect('should handle <version> <book> <chapter>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('Genesis 1 KJV')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('KJV Genesis 1')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('Genesis 1 kjv')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('kjv Gen 1')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
        version: 'kjv',
      });
      expect(yield* parseSearch('KJV Gen 1')).toEqual({
        type: 'BookChapter',
        book: 1,
        chapter: 1,
        version: 'kjv',
      });
    }),
  );

  it.effect('should handle <book> <version>', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('Genesis')).toEqual({
        type: 'Book',
        book: 1,
      });

      expect(yield* parseSearch('Genesis KJV')).toEqual({
        type: 'Book',
        book: 1,
        version: 'kjv',
      });

      expect(yield* parseSearch('kjv Genesis')).toEqual({
        type: 'Book',
        book: 1,
        version: 'kjv',
      });

      expect(yield* parseSearch('Gen.')).toEqual({
        type: 'Book',
        book: 1,
      });

      expect(yield* parseSearch('Gen')).toEqual({
        type: 'Book',
        book: 1,
      });

      expect(yield* parseSearch('Gen kjv')).toEqual({
        type: 'Book',
        book: 1,
        version: 'kjv',
      });
    }),
  );

  it.effect('should not handle searches with no regex matches', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('asdfsdfsd').pipe(Effect.exit)).toEqual(
        yield* Effect.exit(
          Effect.fail(
            new ParseSearchError({
              cause: ParseSearchError.Cause.NoMatch,
              search: 'asdfsdfsd',
            }),
          ),
        ),
      );
      expect(yield* parseSearch('what is truth').pipe(Effect.exit)).toEqual(
        yield* Effect.exit(
          Effect.fail(
            new ParseSearchError({
              cause: ParseSearchError.Cause.NoMatch,
              search: 'what is truth',
            }),
          ),
        ),
      );
    }),
  );

  it.effect('should not handle searches with invalid book names', () =>
    Effect.gen(function* () {
      expect(yield* parseSearch('Rourou 1:1').pipe(Effect.exit)).toEqual(
        yield* Effect.exit(
          Effect.fail(
            new ParseSearchError({
              cause: ParseSearchError.Cause.Invalid,
              search: 'Genesis 1:1:1',
            }),
          ),
        ),
      );
    }),
  );

  it.effect(
    'should not handle searches with invalid chapter or verse numbers',
    () =>
      Effect.gen(function* () {
        expect(yield* parseSearch('Genesis 0:1').pipe(Effect.exit)).toEqual(
          yield* Effect.exit(
            Effect.fail(
              new ParseSearchError({
                cause: ParseSearchError.Cause.Invalid,
                search: 'Genesis 0:1',
              }),
            ),
          ),
        );
        expect(yield* parseSearch('Genesis 1:0').pipe(Effect.exit)).toEqual(
          yield* Effect.exit(
            Effect.fail(
              new ParseSearchError({
                cause: ParseSearchError.Cause.Invalid,
                search: 'Genesis 1:0',
              }),
            ),
          ),
        );
      }),
  );
});
