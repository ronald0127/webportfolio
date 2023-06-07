const productControllers = require("../controllers/productControllers.js");
const auth = require("../auth.js");
const express = require("express");

const router = express.Router();

router.post("/addProduct", auth.verify, productControllers.addProduct);
router.get("/getAllProducts", auth.verify, productControllers.getAllProducts);
router.get("/getActiveProducts", productControllers.getAllActiveProducts);
router.get("/getProduct/:productId", productControllers.getSingleProduct);
router.patch("/updateProduct/:productId", auth.verify, productControllers.updateProduct);
router.patch("/:productId/archive", auth.verify, productControllers.archiveProduct);
router.patch("/:productId/activate", auth.verify, productControllers.activateProduct);

module.exports = router;
