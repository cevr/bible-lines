ALTER TABLE `verses` ADD `embedding` F32_BLOB(64);--> statement-breakpoint
CREATE INDEX `book_version_idx` ON `verses` (`book`,`version`);