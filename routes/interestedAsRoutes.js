import express from "express";

import {
  createInterestedAs,
  getInterestedAs,
  getInterestedAsById,
  updateInterestedAs,
  deleteInterestedAs,
} from "../controllers/interestedAsController.js";

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

// Interested As
router.post("/", createInterestedAs);

router.get("/", getInterestedAs);

router.get("/:id", getInterestedAsById);

router.put("/:id", updateInterestedAs);

router.delete("/:id", deleteInterestedAs);

export default router;