const express = require("express");
const {
  getAssignments,
  getAssignment,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Include other resource routers
const submissionRouter = require("./submissionRouter");

const router = express.Router({ mergeParams: true }); // Important for nested routes

// Re-route into other resource routers
router.use("/:assignmentId/submissions", submissionRouter);

router
  .route("/")
  .get(protect, getAssignments)
  .post(protect, authorize("Teacher", "Admin"), addAssignment);

router
  .route("/:id")
  .get(protect, getAssignment)
  .put(protect, authorize("Teacher", "Admin"), updateAssignment)
  .delete(protect, authorize("Teacher", "Admin"), deleteAssignment);

module.exports = router;
