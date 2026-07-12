import express from "express";

import {
  createEntryType,
  getEntryTypes,
  getEntryTypeById,
  updateEntryType,
  deleteEntryType,
} from "../controllers/entryTypeController.js";

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

// Entry Type
router.post("/", createEntryType);

router.get("/", getEntryTypes);

router.get("/:id", getEntryTypeById);

router.put("/:id", updateEntryType);

router.delete("/:id", deleteEntryType);

export default router;