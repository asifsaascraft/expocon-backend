import express from "express";

import {
  getPublicExhibitions,
  clearPublicExhibitionCache,
} from "../../controllers/public/publicExhibitionController.js";

const router = express.Router();

// =====================================
// TEMPORARY - Clear Redis Cache
// =====================================

// GET /api/public/exhibitions/clear-cache
router.get(
  "/clear-cache",
  clearPublicExhibitionCache,
);

// =====================================
// Public Exhibitions
// =====================================
router.get(
  "/",
  getPublicExhibitions,
);

export default router;