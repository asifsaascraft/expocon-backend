import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  uploadProfileImage,
  deleteProfileImage,
} from "../controllers/userController.js";

import protect from "../middlewares/protect.js";
import verifiedEmail from "../middlewares/verifiedEmail.js";
import checkStatus from "../middlewares/checkStatus.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(verifiedEmail);
router.use(checkStatus);

// Profile
router.get("/profile", getMyProfile);

router.put("/profile", updateMyProfile);

router.patch(
  "/profile/image",
  upload("profile-images").single("profileImage"),
  uploadProfileImage,
);

router.delete(
  "/profile/image",
  deleteProfileImage,
);

// Password
router.patch(
  "/change-password",
  changePassword,
);


export default router;