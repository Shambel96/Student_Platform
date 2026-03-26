const Enrollment = require("../models/EnrollmentModel");
const Course = require("../models/CourseModels");
const User = require("../models/User");

// @desc    Enroll a student in a course
// @route   POST /api/courses/:courseId/enrollments
// @access  Private (Student, Teacher, Admin)
exports.enrollStudent = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    let studentId = req.user._id; // Default to the logged-in user

    // If Teacher/Admin, they can enroll a specific student by passing studentId in body
    if ((req.user.role === "Teacher" || req.user.role === "Admin") && req.body.studentId) {
      studentId = req.body.studentId;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify student exists and has student role
    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      return res.status(400).json({ message: "Invalid student ID or user is not a Student" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students enrolled in a specific course
// @route   GET /api/courses/:courseId/enrollments
// @access  Private
exports.getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.courseId }).populate("studentId", "username email");
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses a student is enrolled in
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
exports.getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id }).populate("courseId", "title description teacherId");
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unenroll a student from a course
// @route   DELETE /api/courses/:courseId/enrollments/:studentId
// @access  Private (Teacher, Admin)
exports.unenrollStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({
      courseId: req.params.courseId,
      studentId: req.params.studentId
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
