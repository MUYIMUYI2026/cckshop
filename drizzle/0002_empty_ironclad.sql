CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(32) NOT NULL,
	`userId` int,
	`customerName` varchar(128) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(32),
	`shippingAddress` text,
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`orderType` enum('retail','wholesale') NOT NULL DEFAULT 'retail',
	`subtotal` decimal(10,2) NOT NULL,
	`shippingFee` decimal(10,2) NOT NULL DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
