import express from "express";

import {
  getPublicCompaniesByCompanyType,
  getPublicCompanies,
  clearPublicCompanyCache,
} from "../../controllers/public/publicCompanyController.js";

const router = express.Router();


// =====================================
// TEMPORARY - Clear Redis Cache
// =====================================

router.get(
  "/clear-cache",
  clearPublicCompanyCache,
);


// =====================================
// Public Companies By Company Type
// =====================================

// GET /api/public/companies/company-type/:companyTypeId
router.get(
  "/company-type/:companyTypeId",
  getPublicCompaniesByCompanyType,
);


// =====================================
// All Public Companies
// Excluding Exhibition Organizer & PCO
// =====================================

// GET /api/public/companies
router.get(
  "/",
  getPublicCompanies,
);


export default router;