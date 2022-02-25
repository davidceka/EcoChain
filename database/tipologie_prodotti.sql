-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 25, 2022 at 09:51 PM
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
-- Table structure for table `tipologie_prodotti`
--

CREATE TABLE `tipologie_prodotti` (
  `nome_prodotto` varchar(45) NOT NULL,
  `quantitaRichiesta` varchar(45) NOT NULL,
  `tipologia` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tipologie_prodotti`
--

INSERT INTO `tipologie_prodotti` (`nome_prodotto`, `quantitaRichiesta`, `tipologia`) VALUES
('Prodotto1a', '10', 'Tipologia1'),
('Prodotto1b', '8', 'Tipologia2'),
('Prodotto1c', '11', 'Tipologia3'),
('Prodotto2a', '4', 'Tipologia1'),
('Prodotto2b', '8', 'Tipologia2'),
('Prodotto2c', '11', 'Tipologia3'),
('Prodotto3a', '5', 'Tipologia1'),
('Prodotto3b', '6', 'Tipologia2'),
('Prodotto3c', '7', 'Tipologia3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tipologie_prodotti`
--
ALTER TABLE `tipologie_prodotti`
  ADD PRIMARY KEY (`nome_prodotto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
