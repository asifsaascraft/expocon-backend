import express from "express";

import {
  createAssociation,
  getAssociations,
  getAssociationById,
  updateAssociation,
  deleteAssociation,
  approveAssociation,
  rejectAssociation,
} from "../controllers/associationController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

//==========================================
// Association Routes
//==========================================

// Create Association
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  createAssociation,
);

// Get All Associations
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getAssociations,
);

// Get Association By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getAssociationById,
);

// Update Association
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  updateAssociation,
);

// Delete Association
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteAssociation,
);

// Approve Association
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveAssociation,
);

// Reject Association
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectAssociation,
);

export default router;