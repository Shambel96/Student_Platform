const Material = require("../models/MaterialModel");
const Course = require("../models/CourseModels");

// @desc    Get materials for a course
// @route   GET /api/courses/:courseId/materials
// @access  Private (Student, Teacher, Admin)
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a material to a course
// @route   POST /api/courses/:courseId/materials
// @access  Private (Teacher, Admin)
exports.addMaterial = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, description, fileUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const material = await Material.create({
      courseId,
      title,
      description,
      fileUrl,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a material
// @route   DELETE /api/courses/:courseId/materials/:id
// @access  Private (Teacher, Admin)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
