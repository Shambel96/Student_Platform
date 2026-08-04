const express = require("express");
const {
  getStudentCourses,
  getCourseOverview,
  submitAssignment,
  getMySubmission,
} = require("../controllers/studentControllers");
const { protect } = require("../middlewares/authMiddleware");
const { isStudent, verifyEnrollment } = require("../middlewares/StudentMiddleware");

const router = express.Router();

router.get("/my-courses", protect, isStudent, getStudentCourses);

router.get(
  "/courses/:courseId",
  protect,
  isStudent,
  verifyEnrollment,
  getCourseOverview
);

router.post(
  "/assignments/:assignmentId/submit",
  protect,
  isStudent,
  submitAssignment
);

router.get(
  "/assignments/:assignmentId/submission",
  protect,
  isStudent,
  getMySubmission
);

module.exports = router;
