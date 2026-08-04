// Business logic for student features.
const Enrollment = require("../models/EnrollmentModel");
const Course = require("../models/CourseModels");
const Assignment = require("../models/AssignmentModel");
const Material = require("../models/MaterialModel");
const Announcement = require("../models/AnnouncementModel");
const Submission = require("../models/SubmissionModel");

class StudentService {
  // Get all courses a student is enrolled in, along with resource counts
  async getStudentCourses(studentId) {
    const enrollments = await Enrollment.find({ studentId }).populate(
      "courseId",
      "title description teacherId"
    );

    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.courseId._id;
        const [assignments, materials, announcements] = await Promise.all([
          Assignment.countDocuments({ courseId }),
          Material.countDocuments({ courseId }),
          Announcement.countDocuments({ courseId }),
        ]);

        return {
          enrollmentId: enrollment._id,
          enrolledAt: enrollment.createdAt,
          course: enrollment.courseId,
          assignments,
          materials,
          announcements,
        };
      })
    );
  }

  // Get a single enrolled course along with its resources
  async getCourseOverview(studentId, courseId) {
    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
      const err = new Error(
        "You must be enrolled in this course to access its resources"
      );
      err.statusCode = 403;
      throw err;
    }

    const [course, assignments, materials, announcements] = await Promise.all([
      Course.findById(courseId).populate("teacherId", "username email"),
      Assignment.find({ courseId }).sort("-createdAt"),
      Material.find({ courseId }).sort("-createdAt"),
      Announcement.find({ courseId }).sort("-createdAt"),
    ]);

    if (!course) {
      const err = new Error("Course not found");
      err.statusCode = 404;
      throw err;
    }

    return { course, assignments, materials, announcements };
  }

  // Submit or update an assignment submission (with enrollment + due date checks)
  async submitAssignment(studentId, assignmentId, content) {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      const err = new Error("Assignment not found");
      err.statusCode = 404;
      throw err;
    }

    // Student must be enrolled in the course the assignment belongs to
    const enrollment = await Enrollment.findOne({
      studentId,
      courseId: assignment.courseId,
    });
    if (!enrollment) {
      const err = new Error(
        "You must be enrolled in this course to submit an assignment"
      );
      err.statusCode = 403;
      throw err;
    }

    // Prevent submissions after the due date
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      const err = new Error("The due date for this assignment has passed");
      err.statusCode = 400;
      throw err;
    }

    let submission = await Submission.findOne({ assignmentId, studentId });
    if (submission) {
      submission.content = content;
      await submission.save();
    } else {
      submission = await Submission.create({ assignmentId, studentId, content });
    }

    return submission;
  }

  // Get the student's own submission for an assignment
  async getSubmission(studentId, assignmentId) {
    const submission = await Submission.findOne({ assignmentId, studentId });
    if (!submission) {
      const err = new Error("No submission found for this assignment");
      err.statusCode = 404;
      throw err;
    }
    return submission;
  }
}

module.exports = new StudentService();
