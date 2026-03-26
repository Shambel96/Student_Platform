const express = require("express");
const {
  getMaterials,
  addMaterial,
  deleteMaterial
} = require("../controllers/materialControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getMaterials)
  .post(protect, authorize("Teacher", "Admin"), addMaterial);

router
  .route("/:id")
  .delete(protect, authorize("Teacher", "Admin"), deleteMaterial);

module.exports = router;
