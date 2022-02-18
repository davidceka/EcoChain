const express = require("express");
const blockchainController = require("../controllers/blockchainController");
const router = express.Router();

router.post('/listrawmaterials',blockchainController.getListRawMaterialsByOwner)
router.post('/listproducts',blockchainController.getProducts)
router.post('/newrawmaterial', blockchainController.creaNuovaMateriaPrima)
router.post('/newproduct', blockchainController.creaNuovoProdotto)
router.post('/acquistoMateriaPrima',blockchainController.acquistoMateriaPrima)

module.exports = router;