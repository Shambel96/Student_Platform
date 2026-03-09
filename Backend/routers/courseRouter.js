const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Include other resource routers
const assignmentRouter = require("./assignmentRouter");

const router = express.Router();

// Re-route into other resource routers
router.use("/:courseId/assignments", assignmentRouter);

router
  .route("/")
  .get(protect, getCourses)
  .post(protect, authorize("Teacher", "Admin"), createCourse);

router
  .route("/:id")
  .get(protect, getCourse)
  .put(protect, authorize("Teacher", "Admin"), updateCourse)
  .delete(protect, authorize("Teacher", "Admin"), deleteCourse);

module.exports = router;
