import express from "express";

import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  approveVenue,
  rejectVenue,
} from "../controllers/venueController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import uploadFiles from "../middlewares/uploadFiles.js";

const router = express.Router();

//==========================================
// Venue Routes
//==========================================

// Create Venue
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  uploadFiles.fields([
    {
      name: "uploadVenuePhoto",
      maxCount: 1,
    },
    {
      name: "uploadVenueLayout",
      maxCount: 1,
    },
  ]),
  createVenue,
);

// Get All Venues
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getVenues,
);

// Get Venue By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getVenueById,
);

// Update Venue
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  uploadFiles.fields([
    {
      name: "uploadVenuePhoto",
      maxCount: 1,
    },
    {
      name: "uploadVenueLayout",
      maxCount: 1,
    },
  ]),
  updateVenue,
);

// Delete Venue
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteVenue,
);

// Approve Venue
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveVenue,
);

// Reject Venue
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectVenue,
);

export default router;