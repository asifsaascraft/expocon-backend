import express from "express";

import {
  getPublicVenues,
  getPublicVenueById,
  getUpcomingConferencesByVenueId,
  getUpcomingExhibitionsByVenueId,
  clearPublicVenueCache,
} from "../../controllers/public/publicVenueController.js";


const router = express.Router();

// TEMPORARY - Clear Redis cache
router.get(
  "/clear-cache",
  clearPublicVenueCache,
);

// =====================================
// Public Venues
// =====================================

// GET /api/public/venues
router.get(
  "/",
  getPublicVenues,
);

// =====================================
// Upcoming Conferences By Venue ID
// =====================================
// GET /api/public/venues/:id/upcoming-conferences
router.get(
  "/:id/upcoming-conferences",
  getUpcomingConferencesByVenueId,
);

// =====================================
// Upcoming Exhibitions By Venue ID
// =====================================
// GET /api/public/venues/:id/upcoming-exhibitions
router.get(
  "/:id/upcoming-exhibitions",
  getUpcomingExhibitionsByVenueId,
);

// GET /api/public/venues/:id
router.get(
  "/:id",
  getPublicVenueById,
);



export default router;