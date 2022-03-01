const express = require("express");
const blockchainController = require("../controllers/blockchainController");
const router = express.Router();

router.get('/newrawmaterial', blockchainController.goToNewRawMaterial)
//router.get('/newproduct', blockchainController.goToNewProduct)

router.post('/addrawmaterial', blockchainController.createNewRawMaterial)
router.post('/addproduct', blockchainController.createNewProduct)

router.post('/listrawmaterials',blockchainController.getListRawMaterialsByOwner)
router.post('/listproducts',blockchainController.getListProductsByOwner)

router.post('/acquistoMateriaPrima',blockchainController.buyRawMaterial)
router.post('/acquistoProdotto', blockchainController.buyProduct)
 
module.exports = router;