-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 08, 2022 at 12:28 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `progetto_cyber`
--

-- --------------------------------------------------------

--
-- Table structure for table `products_type`
--

CREATE TABLE `products_type` (
  `product_name` varchar(45) NOT NULL,
  `required_amount` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products_type`
--

INSERT INTO `products_type` (`product_name`, `required_amount`, `type`) VALUES
('Prodotto1a', '10', 'Tipologia1'),
('Prodotto1b', '8', 'Tipologia2'),
('Prodotto1c', '11', 'Tipologia3'),
('Prodotto2a', '4', 'Tipologia1'),
('Prodotto2b', '8', 'Tipologia2'),
('Prodotto2c', '11', 'Tipologia3'),
('Prodotto3a', '5', 'Tipologia1'),
('Prodotto3b', '6', 'Tipologia2'),
('Prodotto3c', '7', 'Tipologia3');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(70) NOT NULL,
  `wallet_address` varchar(70) NOT NULL,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `role` enum('Producer','Worker','Customer') NOT NULL,
  `type` enum('Tipologia1','Tipologia2','Tipologia3') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `password`, `wallet_address`, `name`, `surname`, `role`, `type`) VALUES
(19, 'produttore1@produttore.it', '$2b$10$BAZXz3mzjIDVDdoLCtyn1O.kh7zd9ueQhSlcPv1SRrTLOc3PXejcG', '0x583A6Df0BBC209674D7c6F2445de755b2bD35302', 'Produttore1', 'Produttore1', 'Producer', 'Tipologia1'),
(20, 'lavoratore1@lavoratore.it', '$2b$10$Wh6fQ34HjLBL7TvLW1e2l.cwVD7j471UG8gTdVKzG.doWdwKDkye.', '0xe87E22B8C1173679C78d234A3929B65D7926C55C', 'Lavoratore1', 'Lavoratore1', 'Worker', 'Tipologia1'),
(21, 'cliente1@cliente.it', '$2b$10$pxWjNcJAqnosWVMqT6UDyuB1n8ywh19ouYv61YiXxn15O7ATPwqme', '0xe2d8fEE5381e4d44a2d80d9244E09685E1F82a73', 'Cliente1', 'Cliente1', 'Customer', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products_type`
--
ALTER TABLE `products_type`
  ADD PRIMARY KEY (`product_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`),
  ADD UNIQUE KEY `wallet_address_UNIQUE` (`wallet_address`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
