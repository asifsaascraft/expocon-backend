import express from "express";

import {
  getPublicStatesWithVenueCount,
  getPublicStatesWithConferenceCount,
  getPublicStatesWithExhibitionCount,
  clearPublicStateCache,
} from "../../controllers/public/publicStateController.js";

const router = express.Router();


// =====================================
// TEMPORARY - Clear Redis Cache
// =====================================

// GET /api/public/states/clear-cache

router.get(
  "/clear-cache",
  clearPublicStateCache,
);


// =====================================
// Public States With Venue Count
// =====================================
router.get(
  "/venue-count",
  getPublicStatesWithVenueCount,
);


// =====================================
// Public States With Upcoming Conference Count
// =====================================
router.get(
  "/conference-count",
  getPublicStatesWithConferenceCount,
);


// =====================================
// Public States With Upcoming Exhibition Count
// =====================================
router.get(
  "/exhibition-count",
  getPublicStatesWithExhibitionCount,
);


export default router;