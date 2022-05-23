-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 23, 2022 at 10:12 PM
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
('Burro', '10', 'Caseari'),
('Cotolette', '8', 'Carne'),
('Panna', '8', 'Caseari'),
('Prosciutto', '5', 'Carne'),
('Salsicce', '4', 'Carne'),
('Sottilette', '8', 'Caseari');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(70) NOT NULL,
  `wallet_address` varchar(100) NOT NULL,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `role` enum('Producer','Worker','Customer') NOT NULL,
  `type` enum('Carne','Caseari') DEFAULT NULL,
  `login_attempts` int(11) NOT NULL,
  `locked_date` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `password`, `wallet_address`, `name`, `surname`, `role`, `type`, `login_attempts`, `locked_date`) VALUES
(54, 'produttore1@produttore.it', '$2b$10$9VLhbEkkHQPhMZn6uOF6J.hq5ZvHumwb4HKuSnTXSBsl.F8vrUKkC', 'U2FsdGVkX1/cV5R0jV0ZaBP6h5NtuN+osvT4aDF4CsWg5hnoU+cWs4n689ACScBFKDTp3vx3xyI29Q==', 'Produttore1', 'Produttore1', 'Producer', 'Carne', 2, 1653336054888),
(55, 'lavoratore1@lavoratore.it', '$2b$10$ukAG2EuMd0DN.cn5q.3/LOYlqJ7wlWssHuHWEwa9OidPUgldsL9nS', 'U2FsdGVkX1+yBVPTUf403hD5/kW3GCG0MGgSNRBVW3kc4/ua+FN94586lI0HP1T360uu62vz3ugidw==', 'Lavoratore1', 'Lavoratore1', 'Worker', 'Carne', 0, 1653336300624),
(56, 'cliente1@cliente.it', '$2b$10$0hu4TtFZmpFXXyNW3cr7mOfXn1JU05cOqLKOjnY3up5N1SfuGsiRK', 'U2FsdGVkX1/s4sFxBtNrlkza3Wdy1HAtwj4JAm6mTLCj0TwOhnULbotpHELHcJlV4cCm2rEg8QcfVQ==', 'Cliente1', 'Cliente1', 'Customer', NULL, 0, 0);

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
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
