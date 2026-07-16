CREATE TABLE `admin_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastLoginAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_accounts_email_unique` UNIQUE(`email`)
);
