import express from "express";

import {
  createJobType,
  getJobTypes,
  getJobTypeById,
  updateJobType,
  deleteJobType,
} from "../controllers/jobTypeController.js";

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

// Job Type
router.post("/", createJobType);

router.get("/", getJobTypes);

router.get("/:id", getJobTypeById);

router.put("/:id", updateJobType);

router.delete("/:id", deleteJobType);

export default router;