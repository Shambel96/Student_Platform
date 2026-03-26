const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: ensure a student only submits once per assignment, or they can overwrite by re-submitting.
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
