import express from "express";

import {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
} from "../controllers/stateController.js";

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

// State
router.post("/", createState);

router.get("/", getStates);

router.get("/:id", getStateById);

router.put("/:id", updateState);

router.delete("/:id", deleteState);

export default router;