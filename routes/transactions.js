const express = require("express");
const blockchainController = require("../controllers/blockchainController");
const router = express.Router();

router.get('/newrawmaterial', blockchainController.goToNewRawMaterial)
router.get('/newproduct', blockchainController.goToNewProduct)

router.post('/addrawmaterial', blockchainController.creaNuovaMateriaPrima)
router.post('/addproduct', blockchainController.creaNuovoProdotto)

router.post('/listrawmaterials',blockchainController.getListRawMaterialsByOwner)
router.post('/listproducts',blockchainController.getProducts)

router.post('/acquistoMateriaPrima',blockchainController.acquistoMateriaPrima)
router.post('/acquistoProdotto', blockchainController.acquistoProdotto)

module.exports = router;