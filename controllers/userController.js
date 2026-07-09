import User from "../models/User.js";
import UserSession from "../models/UserSession.js";

import asyncHandler from "../utils/asyncHandler.js";
import checkDuplicateFields from "../utils/checkDuplicateFields.js";
import deleteS3Object from "../utils/deleteS3Object.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  clearRefreshTokenCookie,
} from "../utils/cookies.js";


//======================
// Get My Profile
//=======================
export const getMyProfile = asyncHandler(async (req, res) => {
  console.log("getMyProfile controller");
  // Get User
  const user = await User.findById(req.user._id);

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  return successResponse(res, {
    message: "Profile fetched successfully.",

    data: user,
  });
});

//====================
// Update My Profile
//=======================
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { fullName, username, mobile, language, timezone } = req.body;

  // Find User

  const user = await User.findById(req.user._id);

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  // Check duplicate username/mobile

  const duplicate = await checkDuplicateFields({
    username: username !== user.username ? username : undefined,

    mobile: mobile !== user.mobile ? mobile : undefined,

    excludeUserId: user._id,
  });

  if (duplicate.exists) {
    return errorResponse(res, {
      statusCode: 400,
      message: duplicate.message,
    });
  }

  // Update fields

  if (fullName !== undefined) {
    user.fullName = fullName.trim();
  }

  if (username !== undefined) {
    user.username = username.trim().toLowerCase();
  }

  if (mobile !== undefined) {
    user.mobile = mobile.trim();
  }

  if (language !== undefined) {
    user.language = language.trim();
  }

  if (timezone !== undefined) {
    user.timezone = timezone.trim();
  }

  await user.save();

  return successResponse(res, {
    message: "Profile updated successfully.",

    data: user,
  });
});

//=======================
// Upload Profile Image
//=======================
export const uploadProfileImage = asyncHandler(async (req, res) => {
  // Check uploaded file

  if (!req.file) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Profile image is required.",
    });
  }

  // Find User
  const user = await User.findById(req.user._id);

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  // Delete old image from S3
  if (user.profileImage) {
    await deleteS3Object(user.profileImage);
  }

  // Save new image URL

  user.profileImage = req.file.location;

  await user.save();

  return successResponse(res, {
    message: "Profile image uploaded successfully.",

    data: user,
  });
});

//=======================
// Delete Profile Image
//=======================
export const deleteProfileImage = asyncHandler(async (req, res) => {
  // Find User

  const user = await User.findById(req.user._id);

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  // Check Profile Image

  if (!user.profileImage) {
    return errorResponse(res, {
      statusCode: 400,
      message: "No profile image found.",
    });
  }

  // Delete from S3

  await deleteS3Object(user.profileImage);

  // Remove from Database

  user.profileImage = null;

  await user.save();

  return successResponse(res, {
    message: "Profile image deleted successfully.",

    data: user,
  });
});

//=======================
// Change Password
//=======================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate
  if (!currentPassword || !newPassword) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Current password and new password are required.",
    });
  }

  if (newPassword.length < 8) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Password must be at least 8 characters long.",
    });
  }

  // Find User
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  // Verify Current Password

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Current password is incorrect.",
    });
  }

  // Prevent Same Password

  const isSamePassword = await user.matchPassword(newPassword);

  if (isSamePassword) {
    return errorResponse(res, {
      statusCode: 400,
      message: "New password must be different from current password.",
    });
  }

  // Update Password

  user.password = newPassword;

  await user.save();

  // Logout From All Devices

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

  // Clear Refresh Cookie

  clearRefreshTokenCookie(res);

  return successResponse(res, {
    message: "Password changed successfully. Please login again.",
  });
});
