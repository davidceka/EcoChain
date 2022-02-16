const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get('/listproducers',authController.getAllProducers)
router.post('/listrawmaterials',authController.getRawMaterials)
router.get('/listworkers',authController.getAllWorkers)
router.post('/listproductss',authController.getProducts)

router.post('/login',authController.login)
router.post('/register',authController.register)
router.get('/logout',authController.logout)


module.exports = router;

//produttore1@libero.it