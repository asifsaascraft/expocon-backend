import express from "express";

import {
  createEventType,
  getEventTypes,
  getEventTypeById,
  updateEventType,
  deleteEventType,
} from "../controllers/eventTypeController.js";

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

// Event Type
router.post("/", createEventType);

router.get("/", getEventTypes);

router.get("/:id", getEventTypeById);

router.put("/:id", updateEventType);

router.delete("/:id", deleteEventType);

export default router;