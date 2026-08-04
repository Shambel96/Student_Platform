const Course = require("../models/CourseModels");
const Enrollment = require("../models/EnrollmentModel");

// Middleware to restrict a route to the Student role only
exports.isStudent = (req, res, next) => {
  if (req.user && req.user.role === "Student") {
    return next();
  }
  return res.status(403).json({ message: "Access restricted to students only" });
};

// Middleware to ensure the user can access a course's resources:
// - Admin can always access
// - The teacher who owns the course can access
// - Students must be enrolled in the course
// If no courseId is present (e.g. top-level routes) it is skipped.
exports.verifyEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    if (!courseId) {
      return next();
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role === "Admin") {
      return next();
    }

    if (req.user.role === "Teacher") {
      if (course.teacherId.toString() === req.user._id.toString()) {
        return next();
      }
      return res.status(403).json({
        message: "You are not the teacher of this course",
      });
    }

    if (req.user.role === "Student") {
      const enrollment = await Enrollment.findOne({
        studentId: req.user._id,
        courseId,
      });

      if (enrollment) {
        return next();
      }

      return res.status(403).json({
        message: "You must be enrolled in this course to access its resources",
      });
    }

    return res.status(403).json({
      message: "You are not authorized to access this course",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
