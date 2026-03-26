const express = require("express");
const {
  enrollStudent,
  getCourseStudents,
  unenrollStudent
} = require("../controllers/enrollmentControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

// mergeParams allows preserving req.params from the parent router (courseRouter)
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getCourseStudents)
  .post(protect, enrollStudent);

router
  .route("/:studentId")
  .delete(protect, authorize("Teacher", "Admin"), unenrollStudent);

module.exports = router;
