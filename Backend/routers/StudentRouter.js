const express = require("express");
const { getStudentCourses } = require("../controllers/enrollmentControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/my-courses", protect, authorize("Student"), getStudentCourses);

module.exports = router;
