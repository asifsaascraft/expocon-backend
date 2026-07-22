import express from "express";

import {
  createConferenceType,
  getConferenceTypes,
  getConferenceTypeById,
  updateConferenceType,
  deleteConferenceType,
} from "../controllers/conferenceTypeController.js";

import protect from "../middlewares/protect.js";
import verifiedEmail from "../middlewares/verifiedEmail.js";
import checkStatus from "../middlewares/checkStatus.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(verifiedEmail);
router.use(checkStatus);
router.use(authorize("admin", "staff"));

// Conference Type
router.post("/", createConferenceType);

router.get("/", getConferenceTypes);

router.get("/:id", getConferenceTypeById);

router.put("/:id", updateConferenceType);

router.delete("/:id", deleteConferenceType);

export default router;