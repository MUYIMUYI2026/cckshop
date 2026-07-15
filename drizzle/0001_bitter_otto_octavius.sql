CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(128),
	`subject` varchar(255),
	`message` text NOT NULL,
	`isWholesaleInquiry` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`category` enum('beauty','skincare','electronics','daily') NOT NULL,
	`retailPrice` decimal(10,2) NOT NULL,
	`wholesalePrice` decimal(10,2) NOT NULL,
	`minWholesaleQty` int NOT NULL DEFAULT 10,
	`stock` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`brand` varchar(128),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isBestSeller` boolean NOT NULL DEFAULT false,
	`isNewArrival` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
