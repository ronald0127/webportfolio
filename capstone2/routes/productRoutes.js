const productControllers = require("../controllers/productControllers.js");
const auth = require("../auth.js");
const express = require("express");

const router = express.Router();

router.post("/addProduct", auth.verify, productControllers.addProduct);
router.get("/getAllProducts", productControllers.getAllProducts);
router.get("/getActiveProducts", productControllers.getAllActiveProducts);
router.patch("/:productId/archive", auth.verify, productControllers.archiveProduct)

module.exports = router;
