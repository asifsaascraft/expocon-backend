import express from "express";

import {
  createExhibitionType,
  getExhibitionTypes,
  getExhibitionTypeById,
  updateExhibitionType,
  deleteExhibitionType,
} from "../controllers/exhibitionTypeController.js";

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

// Exhibition Type
router.post("/", createExhibitionType);

router.get("/", getExhibitionTypes);

router.get("/:id", getExhibitionTypeById);

router.put("/:id", updateExhibitionType);

router.delete("/:id", deleteExhibitionType);

export default router;