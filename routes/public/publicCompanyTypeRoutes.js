import express from "express";

import {
  getPublicCompanyTypes,
  clearPublicCompanyTypeCache,
} from "../../controllers/public/publicCompanyTypeController.js";

const router = express.Router();

// =====================================
// TEMPORARY - Clear Redis Cache
// =====================================

// GET /api/public/company-types/clear-cache

router.get(
  "/clear-cache",
  clearPublicCompanyTypeCache,
);

// =====================================
// Public Company Types
// =====================================

// GET /api/public/company-types

router.get(
  "/",
  getPublicCompanyTypes,
);

export default router;