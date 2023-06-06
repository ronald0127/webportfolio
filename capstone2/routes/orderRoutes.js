const orderControllers = require("../controllers/orderControllers.js");
const express = require("express");

const router = express.Router();

router.get("/getAllOrders", orderControllers.getAllOrders);

module.exports = router;
