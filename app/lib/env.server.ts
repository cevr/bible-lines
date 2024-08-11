import 'dotenv/config';

import { Context, Data, Effect, Layer } from 'effect';
import * as v from 'valibot';

export const NodeEnv = {
	Production: 'production',
	Development: 'development',
} as const;
export type NodeEnv = (typeof NodeEnv)[keyof typeof NodeEnv];

export const AppEnv = {
	Production: 'PRODUCTION',
	Stage: 'STAGE',
	Development: 'DEVELOPMENT',
} as const;
export type AppEnv = (typeof AppEnv)[keyof typeof AppEnv];

export const EnvSchema = v.object({
	NODE_ENV: v.optional(v.enum(NodeEnv), NodeEnv.Development),
	APP_ENV: v.enum(AppEnv),
	DB_URL: v.string(),
	DB_AUTH_TOKEN: v.string(),
	OPENAI_API_KEY: v.string(),
});

export class EnvParsingError extends Data.TaggedError('EnvParsingError')<{
	message: string;
}> {}

const make = Effect.try({
	try: () => v.parse(EnvSchema, process.env),
	catch: (error) => {
		if (v.isValiError(error)) {
			return new EnvParsingError({
				message: `Failed to parse environment variables: ${JSON.stringify(v.flatten(error.issues))}`,
			});
		}
		return new EnvParsingError({
			message: `Failed to parse environment variables`,
		});
	},
});

export class Env extends Context.Tag('Env')<
	Env,
	Effect.Effect.Success<typeof make>
>() {
	static Live = Layer.effect(Env, make);
	static sync = () => v.parse(EnvSchema, process.env);
}
