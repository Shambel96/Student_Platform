const express = require("express");
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require("../controllers/announcementControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getAnnouncements)
  .post(protect, authorize("Teacher", "Admin"), createAnnouncement);

router
  .route("/:id")
  .delete(protect, authorize("Teacher", "Admin"), deleteAnnouncement);

module.exports = router;
