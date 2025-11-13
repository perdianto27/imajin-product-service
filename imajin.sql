-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2025 at 02:48 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imajin`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email` varchar(320) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `email`, `created_at`, `updated_at`) VALUES
('e9ef350a-d45b-450e-8311-ea8b32bff1d9', 'dira@gmail.com', '2025-11-12 10:27:10', '2025-11-12 10:27:10');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `cart_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email` varchar(320) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `total_amount` decimal(14,2) NOT NULL CHECK (`total_amount` >= 0),
  `status` enum('pending','paid','failed','cancelled') NOT NULL,
  `payment_channel` varchar(100) DEFAULT NULL,
  `payment_reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `email`, `order_number`, `total_amount`, `status`, `payment_channel`, `payment_reference`, `created_at`, `updated_at`) VALUES
('3bbba343-37f7-4b6a-a82a-cd276bb46a57', 'dira@gmail.com', 'ORD-1762947362470', '1600000.00', 'pending', 'BCA', 'VA9876543210', '2025-11-12 11:36:02', '2025-11-12 11:36:02'),
('e25b50ee-b54a-4ad6-82a2-ef61008ab498', 'dira@gmail.com', 'ORD-1762993114408', '700000.00', 'pending', 'linkaja', '716338102752', '2025-11-13 00:18:34', '2025-11-13 00:18:34');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL CHECK (`unit_price` >= 0),
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  `subtotal` decimal(14,2) NOT NULL CHECK (`subtotal` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `unit_price`, `quantity`, `subtotal`) VALUES
('0ddff5a7-7a9a-4a3e-839b-099a11729463', '3bbba343-37f7-4b6a-a82a-cd276bb46a57', '531b8a11-c0ef-4a8a-8e71-0363d98b5e78', '800000.00', 2, '1600000.00'),
('d0ccf17b-b30f-4037-b2e5-a9b8dceaa40a', 'e25b50ee-b54a-4ad6-82a2-ef61008ab498', '302a3d78-6470-4471-a0d9-ed8a5f76c236', '700000.00', 1, '700000.00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `sku` varchar(64) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL CHECK (`price` >= 0),
  `stock` int(11) NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `version` bigint(20) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `description`, `price`, `stock`, `is_active`, `version`, `created_at`, `updated_at`) VALUES
('302a3d78-6470-4471-a0d9-ed8a5f76c236', 'TTDR-TD-2025', 'Tempat Tidur', 'Terbuat dari kayu Mahoni', '700000.00', 2, 1, 0, '2025-11-13 00:13:09', '2025-11-13 00:18:34'),
('531b8a11-c0ef-4a8a-8e71-0363d98b5e78', 'MMKN-M-2025', 'Meja Makan', 'Terbuat dari kayu jati', '800000.00', 20, 1, 0, '2025-11-12 09:55:14', '2025-11-12 11:36:02'),
('fc008a02-697f-4f56-aaca-7c57179e409f', 'LBBJU-L-2025', 'Lemari Baju', 'Terbuat dari kayu Mahoni', '900000.00', 12, 1, 0, '2025-11-12 10:58:58', '2025-11-12 10:58:58');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'customer', 'Role untuk pelanggan / pengguna aplikasi', '2025-10-03 09:53:14', '2025-10-03 09:53:14'),
(2, 'admin', 'Role untuk administrator yang mengelola sistem', '2025-10-03 09:53:14', '2025-10-03 09:53:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(320) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `role_id`, `is_active`, `created_at`, `updated_at`) VALUES
(9, 'dira@gmail.com', '$2b$10$mr78bTraeaFIKGbs6w/Dwug830equCxiZx9R0q4da493gYde09Kf.', 'Dira', 1, 1, '2025-11-12 09:38:25', '2025-11-12 09:38:25'),
(10, 'perdi@gmail.com', '$2b$10$XmXMwSu4CFAPIgYzuvYU4e8d4eX3Vmptnrtd3emeCNgZkhFFN6z0O', 'Perdi', 2, 1, '2025-11-12 09:39:02', '2025-11-12 09:39:02'),
(11, 'arif@gmail.com', '$2b$10$vbwu.2LZwZScp9YKR0hbsuM5qX1apm/9UufKXbObQlApTsAMyTdrq', 'Arif', 2, 1, '2025-11-12 23:56:39', '2025-11-12 23:56:39');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `email` varchar(320) NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `email`, `ip_address`, `device_info`, `token`, `created_at`) VALUES
(62, 'arif@gmail.com', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFyaWZAZ21haWwuY29tIiwicm9sZUlkIjoyLCJpYXQiOjE3NjI5OTE4NjQsImV4cCI6MTc2Mjk5NTQ2NH0.7-Zadgvno6axh-j2187kgyqe8q-_Iqg6DvfEcLubwmf4xsKNrwVySgSXOyKshjOEvCmMYFT8J745pIUh-CzUdw', '2025-11-12 23:57:44'),
(63, 'dira@gmail.com', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpcmFAZ21haWwuY29tIiwicm9sZUlkIjoxLCJpYXQiOjE3NjI5OTI4OTAsImV4cCI6MTc2Mjk5NjQ5MH0.0NNzgOsgdoIsEk9UrRfsyUAJByLnMPYZSo2Yxx2oL4nZZ2FJmJK3sfSKiUYyjOa59TAg62Zhf19JT17oLB8K1w', '2025-11-13 00:14:50'),
(65, 'perdi@gmail.com', '127.0.0.1', 'PostmanRuntime/7.50.0', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlcmRpQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNzYyOTk4MDQ5LCJleHAiOjE3NjMwMDE2NDl9.K64eB-6bZHudJH9TBn23nCSMnh50x2yRpDoTs90Hsut32AG0R8ol3JwBDTT9d2IloMDaYBWc7kdkCJZnC0tDYg', '2025-11-13 01:40:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_carts_user` (`email`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_cart_product` (`cart_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
