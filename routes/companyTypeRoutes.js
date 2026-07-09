import express from "express";

import {
  createCompanyType,
  getCompanyTypes,
  getCompanyTypeById,
  updateCompanyType,
  deleteCompanyType,
} from "../controllers/companyTypeController.js";

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

// Company Type
router.post("/", createCompanyType);

router.get("/", getCompanyTypes);

router.get("/:id", getCompanyTypeById);

router.put("/:id", updateCompanyType);

router.delete("/:id", deleteCompanyType);

export default router;