import crypto from "crypto";
import User from "../models/User.js";
import UserSession from "../models/UserSession.js";
import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";

import { successResponse, errorResponse } from "../utils/response.js";

import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";

import {
  getCache,
  setCache,
  deleteCacheByPattern,
} from "../utils/redisCache.js";

//==============================
// Get All Users
//==============================
export const getAllUsers = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "fullName",
    "username",
    "email",
    "mobile",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, ["status"]);

  // Final Query

  const query = {
    role: "user",

    isDeleted: false,

    ...searchQuery,

    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache Key

  const cacheKey = `admin-users:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Users fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // Database

  const [users, total] = await Promise.all([
    User.find(query).sort(sort).skip(skip).limit(limit),

    User.countDocuments(query),
  ]);

  const pagination = buildPaginationMeta(total, page, limit);

  // Cache

  await setCache(
    cacheKey,
    {
      data: users,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Users fetched successfully.",

    data: users,

    pagination,
  });
});

//==============================
// Get All Staffs
//==============================
export const getAllStaffs = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "fullName",
    "username",
    "email",
    "mobile",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, ["status"]);

  // Final Query

  const query = {
    role: "staff",

    isDeleted: false,

    ...searchQuery,

    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache

  const cacheKey = `admin-staffs:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Staffs fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // Database

  const [staffs, total] = await Promise.all([
    User.find(query).sort(sort).skip(skip).limit(limit),

    User.countDocuments(query),
  ]);

  const pagination = buildPaginationMeta(total, page, limit);

  // Cache

  await setCache(
    cacheKey,
    {
      data: staffs,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Staffs fetched successfully.",

    data: staffs,

    pagination,
  });
});

//==============================
// Get All Partners
//==============================
export const getAllPartners = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "fullName",
    "username",
    "email",
    "mobile",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, ["status"]);

  // Final Query

  const query = {
    role: "partner",

    isDeleted: false,

    ...searchQuery,

    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache Key

  const cacheKey = `admin-partners:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Partners fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // Database

  const [partners, total] = await Promise.all([
    User.find(query).sort(sort).skip(skip).limit(limit),

    User.countDocuments(query),
  ]);

  // Pagination Metadata

  const pagination = buildPaginationMeta(total, page, limit);

  // Cache

  await setCache(
    cacheKey,
    {
      data: partners,
      pagination,
    },
    3600,
  );

  // Response

  return successResponse(res, {
    message: "Partners fetched successfully.",

    data: partners,

    pagination,
  });
});

//==============================
// Create Partner
//==============================
export const createPartner = asyncHandler(async (req, res) => {
  const { companyId, email } = req.body;

  //==============================
  // Validate Required Fields
  //==============================

  if (!companyId || !email) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Company ID and email are required.",
    });
  }

  //==============================
  // Validate Company ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  //==============================
  // Normalize Email
  //==============================

  const normalizedEmail = email.trim().toLowerCase();

  //==============================
  // Find Company
  //==============================

  const company = await Company.findOne({
    _id: companyId,
    status: "approved",
  });

  if (!company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  //==============================
  // Check Existing Partner
  //==============================

  const existingPartner = await User.findOne({
    role: "partner",
    companyId: company._id,
    isDeleted: false,
  });

  if (existingPartner) {
    return errorResponse(res, {
      statusCode: 409,
      message: "A partner already exists for this company.",
    });
  }

  //==============================
  // Check Email Already Exists
  //==============================

  const existingUser = await User.findOne({
    email: normalizedEmail,
    isDeleted: false,
  });

  if (existingUser) {
    return errorResponse(res, {
      statusCode: 409,
      message: "A user with this email already exists.",
    });
  }

  //==============================
  // Generate Username
  //==============================

  const username = await generateUsername(company.companyName);

  //==============================
  // Check Generated Username
  //==============================

  const existingUsername = await User.findOne({
    username,
    isDeleted: false,
  });

  if (existingUsername) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Unable to generate a unique partner username.",
    });
  }

  //==============================
  // Generate Temporary Password
  //==============================

  const temporaryPassword = `Exp@${crypto.randomBytes(9).toString("base64url")}`;

  //==============================
  // Create Partner
  //==============================

  const partner = await User.create({
    fullName: company.companyName,

    username,

    email: normalizedEmail,

    password: temporaryPassword,

    role: "partner",

    companyId: company._id,

    status: "active",

    isEmailVerified: true,

    createdBy: req.user._id,
  });

  //==============================
  // Send Partner Login Email
  //==============================

  try {
    await sendEmail({
      to: partner.email,

      name: partner.fullName,

      templateKey: process.env.ZEPTO_PARTNER_WELCOME_TEMPLATE,

      mergeInfo: {
        name: partner.fullName,

        email: partner.email,

        password: temporaryPassword,

        login_link: `${process.env.PARTNER_FRONTEND_URL}/login`,

        current_year: new Date().getFullYear(),
      },
    });
  } catch (error) {
    // Remove account if email could not be sent

    await User.deleteOne({
      _id: partner._id,
    });

    throw error;
  }

  //==============================
  // Clear Partner Redis Cache
  //==============================

  await deleteCacheByPattern("admin-partners:*");
  //==============================
  // Response
  //==============================

  return successResponse(res, {
    statusCode: 201,

    message:
      "Partner created successfully. Login credentials have been sent to the partner's email.",

    data: {
      id: partner._id,

      fullName: partner.fullName,

      username: partner.username,

      email: partner.email,

      role: partner.role,

      companyId: partner.companyId,

      companyName: company.companyName,

      status: partner.status,

      isEmailVerified: partner.isEmailVerified,
    },
  });
});

//==============================
// Suspend / Unsuspend User
//==============================
export const toggleUserSuspension = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find User
  const user = await User.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found.",
    });
  }

  // Admin cannot suspend another admin
  if (user.role === "admin") {
    return errorResponse(res, {
      statusCode: 403,
      message: "Admin accounts cannot be suspended.",
    });
  }

  // Only these roles can be suspended
  const allowedRoles = ["user", "partner", "staff"];

  if (!allowedRoles.includes(user.role)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "This role cannot be suspended.",
    });
  }

  //==============================
  // UNSUSPEND
  //==============================
  if (user.status === "suspended") {
    user.status = "active";

    await user.save();

    // Clear Redis cache
    await deleteCacheByPattern("admin-users:*");
    await deleteCacheByPattern("admin-staffs:*");

    return successResponse(res, {
      message: "User unsuspended successfully.",

      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  }

  //==============================
  // SUSPEND
  //==============================
  user.status = "suspended";

  await user.save();

  //==============================
  // Logout From All Devices
  //==============================

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

  //==============================
  // Clear Redis Cache
  //==============================

  await deleteCacheByPattern("admin-users:*");
  await deleteCacheByPattern("admin-staffs:*");

  return successResponse(res, {
    message: "User suspended successfully.",

    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});
