import express from "express";

import {
  createExhibition,
  getExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibition,
  approveExhibition,
  rejectExhibition,
} from "../controllers/exhibitionController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//==========================================
// Exhibition Routes
//==========================================

// Create Exhibition
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  upload("event-logos").single("uploadEventLogo"),
  createExhibition,
);

// Get All Exhibitions
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getExhibitions,
);

// Get Exhibition By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getExhibitionById,
);

// Update Exhibition
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  upload("event-logos").single("uploadEventLogo"),
  updateExhibition,
);

// Delete Exhibition
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteExhibition,
);

// Approve Exhibition
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveExhibition,
);

// Reject Exhibition
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectExhibition,
);

export default router;