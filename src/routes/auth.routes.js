const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const middleware = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", middleware.authTokenValidation, authController.logoutUser);
router.get("/logoutall", middleware.authTokenValidation, authController.logoutAllUser);

module.exports = router;
