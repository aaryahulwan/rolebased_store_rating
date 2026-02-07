-- MySQL schema for RateMyStore
-- Created from config/schema.js (Drizzle ORM)

CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `address` text,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` text NOT NULL,
  `role` varchar(50) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stores` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `address` text,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` text NOT NULL,
  `role` varchar(50) DEFAULT 'store'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `user_id` int,
  `store_id` int,
  `rating` int NOT NULL,
  CONSTRAINT `ratings_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_store_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
