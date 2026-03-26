const Announcement = require("../models/AnnouncementModel");
const Course = require("../models/CourseModels");

// @desc    Get announcements for a course
// @route   GET /api/courses/:courseId/announcements
// @access  Private (Student, Teacher, Admin)
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement
// @route   POST /api/courses/:courseId/announcements
// @access  Private (Teacher, Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, content } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const announcement = await Announcement.create({
      courseId,
      title,
      content,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/courses/:courseId/announcements/:id
// @access  Private (Teacher, Admin)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
