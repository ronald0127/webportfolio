const orderControllers = require("../controllers/orderControllers.js");
const auth = require("../auth.js");
const express = require("express");

const router = express.Router();

router.post("/checkout", auth.verify, orderControllers.createOrder);
router.get("/getAllOrders", auth.verify, orderControllers.getAllOrders);
router.get("/seeMyOrders", auth.verify, orderControllers.seeMyOrders);
router.patch("/addToCart/:orderId", auth.verify, orderControllers.addProductsToCart);
router.patch("/updateQuantity/:orderId", auth.verify, orderControllers.updateProductQuantity);
router.patch("/removeItem/:orderId", auth.verify, orderControllers.removeItemToCart);

module.exports = router;
