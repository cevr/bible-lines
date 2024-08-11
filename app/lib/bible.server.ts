import { Data, Effect } from 'effect';
import * as v from 'valibot';

import {
	BibleBookNameAndAbbreviationsMap,
	BibleBookNameToNumberMap,
	bibleSearchRegex,
	BibleVersion,
} from './bible';
import { parseValibotSchema } from './valibot';
import type { ValibotParsingError } from './valibot';

const ParseResultSchema = v.object({
	book: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(66)),
	chapter: v.optional(
		v.pipe(
			v.string(),
			v.transform((chapter) => Number(chapter)),
			v.integer(),
			v.minValue(1),
		),
	),
	verse: v.optional(
		v.pipe(
			v.string(),
			v.transform((chapter) => Number(chapter)),
			v.integer(),
			v.minValue(1),
		),
	),
	version: v.optional(
		v.pipe(
			v.string(),
			v.check((version) =>
				Object.values(BibleVersion)
					.map((version) => version.toLowerCase())
					.includes(version.toLowerCase() as any),
			),
			v.transform((version) => version.toLowerCase() as BibleVersion),
		),
	),
});

const abbreviationRegexes = Object.fromEntries(
	Object.entries(BibleBookNameAndAbbreviationsMap).map(
		([book, abbreviations]) => [
			book,
			new RegExp(
				`^(${abbreviations
					.map((abbreviation) => abbreviation.replace(/\./g, '.?'))
					.join('|')})$`,
				'i',
			),
		],
	),
);

const ParseSearchErrorCause = {
	NoMatch: 'NoMatch',
	Invalid: 'Invalid',
} as const;
export type ParseSearchErrorCause =
	(typeof ParseSearchErrorCause)[keyof typeof ParseSearchErrorCause];

export class ParseSearchError extends Data.TaggedError('ParseSearchError')<{
	search: string;
	cause: ParseSearchErrorCause | ValibotParsingError<typeof ParseResultSchema>;
	meta?: unknown;
}> {
	static Cause = ParseSearchErrorCause;
}

export type ParseSearchSuccess =
	| {
			type: 'BookChapterVerse';
			book: number;
			chapter: number;
			verse: number;
			version?: BibleVersion;
	  }
	| {
			type: 'BookChapter';
			book: number;
			chapter: number;
			version?: BibleVersion;
	  }
	| {
			type: 'Book';
			book: number;
			version?: BibleVersion;
	  };

export const parseSearch = (search: string) => {
	const matches = search.match(bibleSearchRegex);
	if (!matches) {
		return Effect.fail(
			new ParseSearchError({
				search,
				cause: ParseSearchErrorCause.NoMatch,
			}),
		);
	}

	let [, version1, book, chapter, verse, version2] = matches;

	// trim and lowercase the book and capitalize the first letter
	book =
		book
			?.trim()
			.toLowerCase()
			.replace(/\b\w/g, (l) => l.toUpperCase()) ?? '';

	return parseValibotSchema(ParseResultSchema, {
		book:
			BibleBookNameToNumberMap[book] ||
			BibleBookNameToNumberMap[
				Object.entries(abbreviationRegexes).find(([_, abbreviations]) =>
					abbreviations.test(book),
				)?.[0] ?? ''
			],
		chapter,
		verse,
		version: version1 || version2,
	}).pipe(
		Effect.map((result) => {
			if (result.chapter && result.verse) {
				return {
					type: 'BookChapterVerse',
					book: result.book,
					chapter: result.chapter,
					verse: result.verse,
					version: result.version,
				};
			}
			if (result.chapter) {
				return {
					type: 'BookChapter',
					book: result.book,
					chapter: result.chapter,
					version: result.version,
				};
			}
			return {
				type: 'Book',
				book: result.book,
				version: result.version,
			};
		}),
		Effect.mapError(
			(error) =>
				new ParseSearchError({
					search,
					cause: error,
					meta: {
						book,
						chapter,
						verse,
						fromNumberMap: BibleBookNameToNumberMap[book],
						fromAbbreviations: Object.entries(
							BibleBookNameAndAbbreviationsMap,
						).find(([_, abbreviations]) => abbreviations.includes(book))?.[0],
					},
				}),
		),
	);
};
