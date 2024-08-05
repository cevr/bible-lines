import { sql } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import type { InferOutput } from 'valibot';
import * as v from 'valibot';

import { createInsertSchema, createSelectSchema } from './drizzle-valibot';

export const Lines = sqliteTable('lines', {
	id: integer('id').primaryKey(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});
const insertSchema = createInsertSchema(Lines);
const selectSchema = createSelectSchema(Lines, {
	createdAt: v.date(),
	updatedAt: v.date(),
});
export namespace Lines {
	export type Input = InferOutput<typeof insertSchema>;
	export type Output = InferOutput<typeof selectSchema>;
}

export const Point = sqliteTable('point', {
	id: integer('id').primaryKey(),
	lineId: integer('line_id')
		.notNull()
		.references(() => Lines.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export namespace Point {
	export type Input = InferInsertModel<typeof Point>;
	export type Output = InferSelectModel<typeof Point>;
}

export const Users = sqliteTable(
	'users',
	{
		id: integer('id').primaryKey(),
		email: text('email').unique().notNull(),
		password: text('password').notNull(),
	},
	(users) => ({
		emailIndex: uniqueIndex('email_idx').on(users.email),
	}),
);
