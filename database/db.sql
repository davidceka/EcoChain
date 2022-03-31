CREATE TABLE `progetto_cyber`.`users` (
`id_utente` INT NOT NULL AUTO_INCREMENT,
`email` VARCHAR(45) NOT NULL,
`password` VARCHAR(70) NOT NULL,
`wallet_address` VARCHAR(70) NOT NULL,
`name` VARCHAR(45) NOT NULL,
`surname` VARCHAR(45) NOT NULL,
`role` ENUM('produttore', 'lavoratore', 'cliente') NOT NULL,
PRIMARY KEY (`id_utente`),
UNIQUE INDEX `email_UNIQUE` (`email` ASC),
UNIQUE INDEX `wallet_address_UNIQUE` (`wallet_address` ASC));