CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verses` (
	`id` text PRIMARY KEY NOT NULL,
	`book` integer NOT NULL,
	`chapter` integer NOT NULL,
	`verse` integer NOT NULL,
	`text` text NOT NULL,
	`version` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `id_version_idx` ON `verses` (`id`,`version`);