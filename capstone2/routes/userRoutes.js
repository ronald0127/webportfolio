const userControllers = require("../controllers/userControllers.js");
const auth = require("../auth.js");
const express = require("express");

const router = express.Router();

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get("/userDetails", auth.verify, userControllers.userDetails);
router.patch("/setAsAdmin", auth.verify, userControllers.setUserAsAdmin);
router.patch("/setAsUser", auth.verify, userControllers.setAdminAsUser);
router.get("/allUsers", auth.verify, userControllers.getAllUsers);

module.exports = router;
