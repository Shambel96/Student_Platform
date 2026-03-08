const Assignment = require("../models/AssignmentModel");
const Course = require("../models/CourseModels");

// @desc    Get assignments for a course
// @route   GET /api/courses/:courseId/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    let query;

    if (req.params.courseId) {
      query = Assignment.find({ courseId: req.params.courseId });
    } else {
      query = Assignment.find().populate({
        path: "courseId",
        select: "title description",
      });
    }

    const assignments = await query;

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate({
      path: "courseId",
      select: "title description",
    });

    if (!assignment) {
      return res.status(404).json({ message: `No assignment with the id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Add assignment
// @route   POST /api/courses/:courseId/assignments
// @access  Private (Teacher, Admin)
exports.addAssignment = async (req, res) => {
  try {
    req.body.courseId = req.params.courseId;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: `No course with the id of ${req.params.courseId}` });
    }

    // Make sure user is course owner
    if (course.teacherId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: `User not authorized to add assignment to course` });
    }

    const assignment = await Assignment.create(req.body);

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teacher, Admin)
exports.updateAssignment = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: `No assignment with the id of ${req.params.id}` });
    }

    // Here we should verify if the user owns the course the assignment belongs to
    // Simplified for now, just checking role
    if (req.user.role !== "Teacher" && req.user.role !== "Admin") {
      return res.status(403).json({ message: `User not authorized to update assignment` });
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teacher, Admin)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: `No assignment with the id of ${req.params.id}` });
    }

    // Check Role
    if (req.user.role !== "Teacher" && req.user.role !== "Admin") {
      return res.status(403).json({ message: `User not authorized to delete assignment` });
    }

    await assignment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
