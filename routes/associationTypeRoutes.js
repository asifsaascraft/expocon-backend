import express from "express";

import {
  createAssociationType,
  getAssociationTypes,
  getAssociationTypeById,
  updateAssociationType,
  deleteAssociationType,
} from "../controllers/associationTypeController.js";

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

// Association Type
router.post("/", createAssociationType);

router.get("/", getAssociationTypes);

router.get("/:id", getAssociationTypeById);

router.put("/:id", updateAssociationType);

router.delete("/:id", deleteAssociationType);

export default router;