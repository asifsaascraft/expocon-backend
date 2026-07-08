import express from "express";

import {
  registerAdmin,
  registerUser,
  inviteStaff,
  acceptInvitation,
  setStaffPassword,
  verifyEmail,
  resendVerificationEmail,
  login,
  refreshToken,
  logout,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// Public Routes
router.post("/register/admin", registerAdmin);
router.post("/register/user", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.get(
  "/accept-invitation/:token",
  acceptInvitation,
);
router.post(
  "/set-password/:token",
  setStaffPassword,
);
router.post(
  "/resend-verification-email",
  resendVerificationEmail,
);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  resetPassword,
);

// Staff Invitation (Admin Only)
router.post(
  "/invite/staff",
  protect,
  authorize("admin"),
  inviteStaff,
);

// Protected Routes
router.post(
  "/logout",
  protect,
  logout,
);
router.post(
  "/logout-all",
  protect,
  logoutAllDevices,
);

export default router;