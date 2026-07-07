import User from "../models/User.js";
import jwt from "jsonwebtoken";
import UserSession from "../models/UserSession.js";
import getDeviceInfo from "../utils/getDeviceInfo.js";
import generateTokens from "../utils/generateTokens.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/cookies.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import generateRandomToken from "../utils/generateRandomToken.js";
import sendEmail from "../utils/sendEmail.js";
import checkDuplicateFields from "../utils/checkDuplicateFields.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Register Admin
export const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, username, email, mobile, password } = req.body;

  // Validate required fields

  if (!fullName || !email || !password) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Full name, email and password are required.",
    });
  }

  // Check admin already exists

  const adminExists = await User.findOne({
    role: "admin",
    isDeleted: false,
  });

  if (adminExists) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Admin already registered.",
    });
  }

  // Check duplicate
  const duplicate = await checkDuplicateFields({
    email,
    username,
    mobile,
  });

  if (duplicate.exists) {
    return errorResponse(res, {
      statusCode: 400,
      message: duplicate.message,
    });
  }

  // Generate verification token

  const { rawToken, hashedToken } = generateRandomToken();

  // Create admin

  const user = await User.create({
    fullName,
    username,
    email,
    mobile,
    password,

    role: "admin",

    status: "pending",

    isEmailVerified: false,

    emailVerificationToken: hashedToken,

    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // Verification Link

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

  // Send Verification Email

  await sendEmail({
    to: user.email,

    name: user.fullName,

    templateKey: process.env.ZEPTO_VERIFY_EMAIL_TEMPLATE,

    mergeInfo: {
      name: user.fullName,

      verification_link: verificationLink,
    },
  });

  return successResponse(res, {
    statusCode: 201,

    message: "Admin registered successfully. Please verify your email.",

    data: {
      id: user._id,

      fullName: user.fullName,

      email: user.email,

      role: user.role,

      status: user.status,
    },
  });
});

// Verify Email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Verification token is required.",
    });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,

    emailVerificationExpires: {
      $gt: new Date(),
    },

    isDeleted: false,
  });

  if (!user) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid or expired verification link.",
    });
  }

  if (user.isEmailVerified) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email already verified.",
    });
  }

  user.isEmailVerified = true;

  user.status = "active";

  user.emailVerificationToken = null;

  user.emailVerificationExpires = null;

  await user.save({
    validateBeforeSave: false,
  });

  await sendEmail({
    to: user.email,

    name: user.fullName,

    templateKey: process.env.ZEPTO_WELCOME_TEMPLATE,

    mergeInfo: {
      name: user.fullName,
      login_link: `${process.env.FRONTEND_URL}/login`,
    },
  });

  return successResponse(res, {
    message: "Email verified successfully.",
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate

  if (!email || !password) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email and password are required.",
    });
  }

  // Find User

  const user = await User.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  }).select("+password");

  if (!user) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid email.",
    });
  }

  // Account Locked

  if (user.isLocked) {
    return errorResponse(res, {
      statusCode: 423,
      message:
        "Account temporarily locked due to multiple failed login attempts.",
    });
  }

  // Compare Password

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    await user.incrementLoginAttempts();

    return errorResponse(res, {
      statusCode: 401,
      message: "Wrong password.",
    });
  }

  // Reset Failed Attempts

  await user.resetLoginAttempts();

  // Email Verification

  if (!user.isEmailVerified) {
    return errorResponse(res, {
      statusCode: 403,
      message: "Please verify your email first.",
    });
  }

  // Status

  if (user.status !== "active") {
    return errorResponse(res, {
      statusCode: 403,
      message: `Your account is ${user.status}.`,
    });
  }

  // Device Information

  const deviceInfo = getDeviceInfo(req);

  // Update Login Information

  await user.updateLoginInfo();

  // Generate Tokens

  const { accessToken, refreshToken } = await generateTokens({
    user,
    req,
    deviceInfo,
  });

  // Save Refresh Cookie

  setRefreshTokenCookie(res, refreshToken);

  return successResponse(res, {
    message: "Login successful.",

    data: {
      accessToken,
      user,
    },
  });
});

// Refresh Access Token
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Refresh token is missing.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid or expired refresh token.",
    });
  }

  const session = await UserSession.findOne({
    sessionId: decoded.sessionId,
    isActive: true,
  }).select("+refreshTokenHash");

  if (!session) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Session not found.",
    });
  }

  if (session.expiresAt < new Date()) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Session expired.",
    });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  if (hashedToken !== session.refreshTokenHash) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid refresh token.",
    });
  }

  const user = await User.findById(decoded.id).select("+password");

  if (!user || user.isDeleted) {
    return errorResponse(res, {
      statusCode: 401,
      message: "User not found.",
    });
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Password changed. Please login again.",
    });
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      sessionId: session.sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "15m",
    },
  );

  return successResponse(res, {
    message: "Access token refreshed successfully.",
    data: {
      accessToken,
    },
  });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  req.session.isActive = false;
  req.session.loggedOutAt = new Date();

  await req.session.save();

  clearRefreshTokenCookie(res);

  return successResponse(res, {
    message: "Logged out successfully.",
  });
});

// Logout From All Devices
export const logoutAllDevices = asyncHandler(async (req, res) => {
  await UserSession.updateMany(
    {
      user: req.user._id,
      isActive: true,
    },
    {
      isActive: false,
      loggedOutAt: new Date(),
    },
  );

  clearRefreshTokenCookie(res);

  return successResponse(res, {
    message: "Logged out from all devices successfully.",
  });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email is required.",
    });
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  // Don't reveal whether email exists

  if (!user) {
    return successResponse(res, {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  }

  // Generate Reset Token

  const { rawToken, hashedToken } = generateRandomToken();

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save({
    validateBeforeSave: false,
  });

  // Reset Link

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

  // Send Email

  await sendEmail({
    to: user.email,

    name: user.fullName,

    templateKey: process.env.ZEPTO_FORGOT_PASSWORD_TEMPLATE,

    mergeInfo: {
      name: user.fullName,
      reset_password_link: resetLink,
    },
  });

  return successResponse(res, {
    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Reset token is required.",
    });
  }

  if (!password) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Password is required.",
    });
  }

  // Hash Token

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find User

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: new Date(),
    },
    isDeleted: false,
  }).select("+password");

  if (!user) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid or expired reset link.",
    });
  }

  // Update Password

  user.password = password;

  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save();

  // Logout All Devices

  await UserSession.updateMany(
    {
      user: user._id,
      isActive: true,
    },
    {
      isActive: false,
      loggedOutAt: new Date(),
    },
  );

  return successResponse(res, {
    message: "Password reset successfully. Please login again.",
  });
});

// Resend Verification Email
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email is required.",
    });
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  // Don't reveal account existence

  if (!user) {
    return successResponse(res, {
      message:
        "If an account exists and is not verified, a verification email has been sent.",
    });
  }

  // Already verified

  if (user.isEmailVerified) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email is already verified.",
    });
  }

  // Generate new verification token

  const { rawToken, hashedToken } = generateRandomToken();

  user.emailVerificationToken = hashedToken;

  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save({
    validateBeforeSave: false,
  });

  // Verification Link

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

  // Send Email

  await sendEmail({
    to: user.email,

    name: user.fullName,

    templateKey: process.env.ZEPTO_VERIFY_EMAIL_TEMPLATE,

    mergeInfo: {
      name: user.fullName,
      verification_link: verificationLink,
    },
  });

  return successResponse(res, {
    message:
      "If an account exists and is not verified, a verification email has been sent.",
  });
});
