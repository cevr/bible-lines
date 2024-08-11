ALTER TABLE `verses` ADD `embedding` F32_BLOB(1536);--> statement-breakpoint
CREATE INDEX `book_version_idx` ON `verses` (`book`,`version`);--> statement-breakpoint
CREATE INDEX `chapter_verse_idx` ON `verses` (`chapter`,`verse`);