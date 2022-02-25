const express = require("express");
const dbController = require("../controllers/dbController");

const router = express.Router();

router.get('/listproducers',dbController.getAllProducers)
router.get('/listworkers',dbController.getAllWorkers)
router.get('/newproduct', dbController.getAllProductsByType)

module.exports = router;