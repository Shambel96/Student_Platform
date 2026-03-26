const Submission = require("../models/SubmissionModel");
const Assignment = require("../models/AssignmentModel");

// @desc    Submit an assignment
// @route   POST /api/assignments/:assignmentId/submissions
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { content } = req.body;
    const assignmentId = req.params.assignmentId;
    const studentId = req.user._id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if submission already exists, allow update if so
    let submission = await Submission.findOne({ assignmentId, studentId });
    if (submission) {
      submission.content = content;
      await submission.save();
    } else {
      submission = await Submission.create({
        assignmentId,
        studentId,
        content,
      });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:assignmentId/submissions
// @access  Private (Teacher, Admin)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId }).populate("studentId", "username email");
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's submission for an assignment
// @route   GET /api/assignments/:assignmentId/submissions/my-submission
// @access  Private (Student)
exports.getStudentSubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({ 
      assignmentId: req.params.assignmentId, 
      studentId: req.user._id 
    });
    
    if (!submission) {
      return res.status(404).json({ message: "No submission found" });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade a submission
// @route   PUT /api/assignments/:assignmentId/submissions/:submissionId/grade
// @access  Private (Teacher, Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.grade = grade;
    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    await submission.save();
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
