const orderControllers = require("../controllers/orderControllers.js");
const auth = require("../auth.js");
const express = require("express");

const router = express.Router();

router.post("/checkout", auth.verify, orderControllers.createOrder);
router.get("/getAllOrders", auth.verify, orderControllers.getAllOrders);
router.get("/seeMyOrders", auth.verify, orderControllers.seeMyOrders);
router.get("/addToCart/:orderId", auth.verify, orderControllers.addProductsToCart);

module.exports = router;
