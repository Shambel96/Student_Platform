const Course = require("../models/CourseModels");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacherId", "username email");
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacherId", "username email");

    if (!course) {
      return res.status(404).json({ message: `Course not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Teacher, Admin)
exports.createCourse = async (req, res) => {
  try {
    // Add user to req.body
    req.body.teacherId = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher, Admin)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: `Course not found with id of ${req.params.id}` });
    }

    // Make sure user is course owner or admin
    if (course.teacherId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: `User not authorized to update this course` });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher, Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: `Course not found with id of ${req.params.id}` });
    }

    // Make sure user is course owner or admin
    if (course.teacherId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: `User not authorized to delete this course` });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
