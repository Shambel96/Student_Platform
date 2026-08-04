const express = require("express");
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require("../controllers/announcementControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { verifyEnrollment } = require("../middlewares/StudentMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, verifyEnrollment, getAnnouncements)
  .post(protect, authorize("Teacher", "Admin"), verifyEnrollment, createAnnouncement);

router
  .route("/:id")
  .delete(protect, authorize("Teacher", "Admin"), verifyEnrollment, deleteAnnouncement);

module.exports = router;
