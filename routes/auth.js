const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

/*
Definizioni rotte per le procedure di POST relative agli accessi o alla gestione degli account
*/
router.post('/signup', authController.register);
router.post('/login', authController.login);

module.exports = router;