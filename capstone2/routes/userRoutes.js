const userControllers = require("../controllers/userControllers.js");
const express = require("express");

const router = express.Router();

router.post("/register", userControllers.registerUser);
router.get("/login", userControllers.loginUser);
router.get("/userDetails", userControllers.userDetails);

module.exports = router;
