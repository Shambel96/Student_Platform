const express = require("express");
const {
  getMaterials,
  addMaterial,
  deleteMaterial
} = require("../controllers/materialControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { verifyEnrollment } = require("../middlewares/StudentMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, verifyEnrollment, getMaterials)
  .post(protect, authorize("Teacher", "Admin"), verifyEnrollment, addMaterial);

router
  .route("/:id")
  .delete(protect, authorize("Teacher", "Admin"), verifyEnrollment, deleteMaterial);

module.exports = router;
