import express from "express";

import {
  getPublicStatesWithVenueCount,
  clearPublicStateCache,
} from "../../controllers/public/publicStateController.js";

const router = express.Router();

// =====================================
// Public States
// =====================================

// GET /api/public/states
router.get(
  "/",
  getPublicStatesWithVenueCount,
);

// =====================================
// TEMPORARY - Clear Redis Cache
// =====================================

// GET /api/public/states/clear-cache
router.get(
  "/clear-cache",
  clearPublicStateCache,
);

export default router;