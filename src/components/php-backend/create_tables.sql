-- create_tables.sql
-- Run this in your MySQL (XAMPP) to create the required tables for the PHP backend
-- TABLES: `user`, `transaction`

CREATE DATABASE IF NOT EXISTS `capstone` CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_general_ci';
USE `capstone`;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `surname` VARCHAR(50) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `course` VARCHAR(50) NOT NULL DEFAULT '',
  `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `password` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL DEFAULT 0
);

-- transaction table uses column `date` per your spec (if you prefer `date_created` change accordingly)
CREATE TABLE IF NOT EXISTS `transaction` (
  `reference_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `reward` VARCHAR(50) NOT NULL,
  `points_used` INT NOT NULL DEFAULT 0,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  INDEX (`user_id`),
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
