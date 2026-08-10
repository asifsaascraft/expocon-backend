import express from "express";

import {
  getPublicVenues,
  getPublicVenueById,
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

// GET /api/public/venues/:id
router.get(
  "/:id",
  getPublicVenueById,
);




export default router;