CREATE TABLE `egw` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`embedding` F32_BLOB(3072)
);
