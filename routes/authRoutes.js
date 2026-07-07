import express from "express";

import {
  registerAdmin,
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

const router = express.Router();

// Public Routes

router.post("/register/admin", registerAdmin);

router.get("/verify-email/:token", verifyEmail);

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