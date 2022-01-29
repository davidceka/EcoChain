const express = require("express");
const blockchainController = require("../controllers/blockchainController");
const router = express.Router();

router.post('/newrawmaterial', blockchainController.creaNuovaMateriaPrima)
router.post('/newproduct', blockchainController.creaNuovoProdotto)

module.exports = router;