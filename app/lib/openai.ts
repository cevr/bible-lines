import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';
import { Context, Data, Effect, Layer } from 'effect';

import { Env } from './env.server';

const OpenAIEmbedModel = {
	Large: 'large',
	Small: 'small',
} as const;
export type OpenAIEmbedModel =
	(typeof OpenAIEmbedModel)[keyof typeof OpenAIEmbedModel];
export class OpenAIError extends Data.TaggedError('OpenAIError')<{
	message: string;
	cause: unknown;
}> {}

const make = Effect.gen(function* () {
	const env = yield* Env;
	return yield* Effect.succeed({
		embed: (
			text: string,
			{
				size = OpenAIEmbedModel.Large,
				...opts
			}: {
				size?: OpenAIEmbedModel;
			} & Parameters<typeof openai.embedding>[1] = {},
		) =>
			Effect.tryPromise({
				try: async (signal) => {
					return await embed({
						model: openai.embedding(
							size === OpenAIEmbedModel.Large
								? 'text-embedding-3-large'
								: 'text-embedding-3-small',
							{
								...opts,
							},
						),
						value: text,
						abortSignal: signal,
						headers: {
							Authorization: `Bearer ${env.OPENAI_API_KEY}`,
						},
					});
				},
				catch: (error) => {
					return new OpenAIError({
						message: `Failed to embed text`,
						cause: error,
					});
				},
			}).pipe(Effect.withSpan('openai.embed')),
		embedMany: (
			texts: string[],
			{
				size = OpenAIEmbedModel.Large,
				...opts
			}: {
				size?: OpenAIEmbedModel;
			} & Parameters<typeof openai.embedding>[1] = {},
		) =>
			Effect.tryPromise({
				try: async (signal) => {
					return await embedMany({
						model: openai.embedding(
							size === OpenAIEmbedModel.Large
								? 'text-embedding-3-large'
								: 'text-embedding-3-small',
							{
								...opts,
							},
						),
						values: texts,
						abortSignal: signal,
						headers: {
							Authorization: `Bearer ${env.OPENAI_API_KEY}`,
						},
					});
				},
				catch: (error) => {
					return new OpenAIError({
						message: `Failed to embed text`,
						cause: error,
					});
				},
			}).pipe(Effect.withSpan('openai.embedMany')),
	});
});

export class OpenAI extends Context.Tag('OpenAI')<
	OpenAI,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(this, make);
	static EmbedModel = OpenAIEmbedModel;
}
