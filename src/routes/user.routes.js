const express = require("express");
const router = express.Router();
const eventController = require("../controllers/user.controller");

router.delete("", eventController.removeUserRecord);
router.patch("", eventController.updateUserRecord);

module.exports = router;
