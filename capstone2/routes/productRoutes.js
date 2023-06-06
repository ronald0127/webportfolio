const productControllers = require("../controllers/productControllers.js");
const express = require("express");

const router = express.Router();

router.get("/getAllProducts", productControllers.getAllProducts);

module.exports = router;
