import { sql } from 'drizzle-orm';
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import { BibleVersion } from '../bible';
import { vector } from './vector.server';

export const users = sqliteTable(
	'users',
	{
		id: integer('id').primaryKey({
			autoIncrement: true,
		}),
		email: text('email').unique().notNull(),
		password: text('password').notNull(),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(current_timestamp)`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(current_timestamp)`),
	},
	(users) => ({
		emailIndex: uniqueIndex('email_idx').on(users.email),
	}),
);

export const verses = sqliteTable(
	'verses',
	{
		id: text('id').primaryKey(), // e.g. '1:1:1'
		book: integer('book').notNull(), // e.g. 1
		chapter: integer('chapter').notNull(), // e.g. 1
		verse: integer('verse').notNull(), // e.g. 1
		text: text('text').notNull(), // e.g. 'In the beginning God created the heavens and the earth.'
		version: text('version', {
			enum: Object.values(BibleVersion) as [BibleVersion, ...BibleVersion[]],
		}).notNull(), // e.g. 'KJV'
		embedding: vector('embedding', {
			length: 1536,
		}), // e.g. [0.1, 0.2, 0.3]
	},
	(verses) => ({
		idVersionIndex: uniqueIndex('id_version_idx').on(verses.id, verses.version),
		bookVersionIndex: index('book_version_idx').on(verses.book, verses.version),
	}),
);
