CREATE TABLE `egw` (
	`id` text PRIMARY KEY NOT NULL,
	`book` text NOT NULL,
	`key` integer NOT NULL,
	`refcode` text NOT NULL,
	`text` text NOT NULL,
	`embedding` F32_BLOB(3072)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_key_idx` ON `egw` (`book`,`key`);