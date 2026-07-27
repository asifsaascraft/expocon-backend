import express from "express";

import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  approveAdvertisement,
  rejectAdvertisement,
} from "../controllers/advertisementController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//==============================
// Advertisement Routes
//==============================

// Create Advertisement
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  upload("advertisements").single("uploadAdvertisementLogo"),
  createAdvertisement,
);

// Get All Advertisements
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getAdvertisements,
);

// Get Advertisement By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getAdvertisementById,
);

// Update Advertisement
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  upload("advertisements").single("uploadAdvertisementLogo"),
  updateAdvertisement,
);

// Delete Advertisement
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteAdvertisement,
);

// Approve Advertisement
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveAdvertisement,
);

// Reject Advertisement
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectAdvertisement,
);

export default router;