import express from "express";

import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  approveCompany,
  rejectCompany,
} from "../controllers/companyController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//==========================================
// Company Routes
//==========================================

// Create Company
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  upload("company-logos").single("uploadLogo"),
  createCompany,
);

// Get All Companies
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getCompanies,
);

// Get Company By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getCompanyById,
);

// Update Company
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  upload("company-logos").single("uploadLogo"),
  updateCompany,
);

// Delete Company
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteCompany,
);

// Approve Company
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveCompany,
);

// Reject Company
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectCompany,
);

export default router;