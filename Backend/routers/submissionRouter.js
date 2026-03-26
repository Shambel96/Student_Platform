const express = require("express");
const {
  submitAssignment,
  getAssignmentSubmissions,
  getStudentSubmission,
  gradeSubmission
} = require("../controllers/submissionControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("Teacher", "Admin"), getAssignmentSubmissions)
  .post(protect, authorize("Student"), submitAssignment);

router.get("/my-submission", protect, authorize("Student"), getStudentSubmission);

router.put("/:submissionId/grade", protect, authorize("Teacher", "Admin"), gradeSubmission);

module.exports = router;
