import express from "express";

import {
  getPublicConferences,
  clearPublicConferenceCache,
} from "../../controllers/public/publicConferenceController.js";

const router = express.Router();

// =====================================
// TEMPORARY - Clear Redis Cache
// =====================================
// GET /api/public/conferences/clear-cache
router.get(
  "/clear-cache",
  clearPublicConferenceCache,
);

// =====================================
// Public Conferences
// =====================================
router.get(
  "/",
  getPublicConferences,
);

export default router;