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

const EnvSchema = v.object({
	NODE_ENV: v.enum(NodeEnv),
	APP_ENV: v.enum(AppEnv),
	DB_URL: v.string(),
	DB_AUTH_TOKEN: v.string(),
	OPEN_AI_API_KEY: v.string(),
});

export const Env = v.parse(EnvSchema, process.env);
export type Env = v.InferOutput<typeof EnvSchema>;
