import express from "express";

import {
  createAdvertisementLocation,
  getAdvertisementLocations,
  getAdvertisementLocationById,
  updateAdvertisementLocation,
  deleteAdvertisementLocation,
} from "../controllers/advertisementLocationController.js";

import protect from "../middlewares/protect.js";
import verifiedEmail from "../middlewares/verifiedEmail.js";
import checkStatus from "../middlewares/checkStatus.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(verifiedEmail);
router.use(checkStatus);
router.use(authorize("admin"));

// Advertisement Location
router.post("/", createAdvertisementLocation);

router.get("/", getAdvertisementLocations);

router.get("/:id", getAdvertisementLocationById);

router.put("/:id", updateAdvertisementLocation);

router.delete("/:id", deleteAdvertisementLocation);

export default router;