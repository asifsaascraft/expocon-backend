import express from "express";

import {
  createConferenceSegment,
  getConferenceSegments,
  getConferenceSegmentById,
  updateConferenceSegment,
  deleteConferenceSegment,
} from "../controllers/conferenceSegmentController.js";

import protect from "../middlewares/protect.js";
import verifiedEmail from "../middlewares/verifiedEmail.js";
import checkStatus from "../middlewares/checkStatus.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(verifiedEmail);
router.use(checkStatus);
router.use(authorize("admin"));

// Conference Segment
router.post("/", createConferenceSegment);

router.get("/", getConferenceSegments);

router.get("/:id", getConferenceSegmentById);

router.put("/:id", updateConferenceSegment);

router.delete("/:id", deleteConferenceSegment);

export default router;