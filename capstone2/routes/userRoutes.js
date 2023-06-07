const userControllers = require("../controllers/userControllers.js");
const auth = require("../auth.js");
const express = require("express");

const router = express.Router();

router.post("/register", userControllers.registerUser);
router.get("/login", userControllers.loginUser);
router.get("/userDetails", userControllers.userDetails);
router.patch("/setAsAdmin", auth.verify, userControllers.setUserAsAdmin);

module.exports = router;