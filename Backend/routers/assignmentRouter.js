const express = require("express");
const {
  getAssignments,
  getAssignment,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true }); // Important for nested routes

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
