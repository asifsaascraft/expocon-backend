import express from "express";

import {
  createMonth,
  getMonths,
  getMonthById,
  updateMonth,
  deleteMonth,
} from "../controllers/monthController.js";

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

// Month
router.post("/", createMonth);

router.get("/", getMonths);

router.get("/:id", getMonthById);

router.put("/:id", updateMonth);

router.delete("/:id", deleteMonth);

export default router;