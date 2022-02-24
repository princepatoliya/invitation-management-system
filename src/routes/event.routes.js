const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/create", eventController.createEvent);
router.patch("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
