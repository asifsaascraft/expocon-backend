import express from "express";

import {
  createConference,
  getConferences,
  getConferenceById,
  updateConference,
  deleteConference,
  approveConference,
  rejectConference,
} from "../controllers/conferenceController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//==========================================
// Conference Routes
//==========================================

// Create Conference
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  upload("conference-logos").single("uploadConferenceLogo"),
  createConference,
);

// Get All Conferences
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getConferences,
);

// Get Conference By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getConferenceById,
);

// Update Conference
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  upload("conference-logos").single("uploadConferenceLogo"),
  updateConference,
);

// Delete Conference
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteConference,
);

// Approve Conference
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveConference,
);

// Reject Conference
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectConference,
);

export default router;