const StudentService = require("../services/StudentService");

// @desc    Get all courses a student is enrolled in
// @route   GET /api/students/my-courses
// @access  Private (Student)
exports.getStudentCourses = async (req, res) => {
  try {
    const courses = await StudentService.getStudentCourses(req.user._id);
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get a single enrolled course with its resources
// @route   GET /api/students/courses/:courseId
// @access  Private (Student, enrolled)
exports.getCourseOverview = async (req, res) => {
  try {
    const data = await StudentService.getCourseOverview(
      req.user._id,
      req.params.courseId
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Submit or update an assignment
// @route   POST /api/students/assignments/:assignmentId/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const submission = await StudentService.submitAssignment(
      req.user._id,
      req.params.assignmentId,
      req.body.content
    );
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get the student's own submission for an assignment
// @route   GET /api/students/assignments/:assignmentId/submission
// @access  Private (Student)
exports.getMySubmission = async (req, res) => {
  try {
    const submission = await StudentService.getSubmission(
      req.user._id,
      req.params.assignmentId
    );
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
