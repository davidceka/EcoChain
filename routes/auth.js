const express = require("express");
const res = require("express/lib/response");
const authController = require("../controllers/authController");
const router = express.Router();


router.post('/login',authController)





module.exports = router;