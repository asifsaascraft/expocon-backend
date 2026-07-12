import mongoose from "mongoose";

import Month from "../models/Month.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../utils/pagination.js";

import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";

import {
  getCache,
  setCache,
  deleteCacheByPattern,
} from "../utils/redisCache.js";

//==============================
// Create Month
//==============================
export const createMonth = asyncHandler(async (req, res) => {
  const { month } = req.body;

  // Validate

  if (!month?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Month is required.",
    });
  }

  // Check Duplicate

  const existingMonth = await Month.findOne({
    month: month.trim(),
  });

  if (existingMonth) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This month already exists.",
    });
  }

  // Create

  const newMonth = await Month.create({
    month: month.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("months*");

  return successResponse(res, {
    statusCode: 201,

    message: "Month created successfully.",

    data: newMonth,
  });
});

//==============================
// Get Months
//==============================
export const getMonths = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "month",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, []);

  // Final Query

  const query = {
    ...searchQuery,
    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache Key

  const cacheKey = `months:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Months fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [months, total] = await Promise.all([
    Month.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Month.countDocuments(query),
  ]);

  const pagination = buildPaginationMeta(
    total,
    page,
    limit,
  );

  // Save Cache

  await setCache(
    cacheKey,
    {
      data: months,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Months fetched successfully.",

    data: months,

    pagination,
  });
});

//==============================
// Get Month By ID
//==============================
export const getMonthById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid month ID.",
    });
  }

  // Cache Key

  const cacheKey = `month:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Month fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const month = await Month.findById(id);

  if (!month) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Month not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, month, 3600);

  return successResponse(res, {
    message: "Month fetched successfully.",

    data: month,
  });
});

//==============================
// Update Month
//==============================
export const updateMonth = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { month } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid month ID.",
    });
  }

  // Validate

  if (!month?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Month is required.",
    });
  }

  // Find Month

  const existingMonth = await Month.findById(id);

  if (!existingMonth) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Month not found.",
    });
  }

  // Check Duplicate

  const duplicateMonth = await Month.findOne({
    month: month.trim(),
    _id: { $ne: id },
  });

  if (duplicateMonth) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Month already exists.",
    });
  }

  // Update

  existingMonth.month = month.trim();

  await existingMonth.save();

  // Clear Redis Cache

  await deleteCacheByPattern("months*");
  await deleteCacheByPattern("month*");

  return successResponse(res, {
    message: "Month updated successfully.",

    data: existingMonth,
  });
});

//==============================
// Delete Month
//==============================
export const deleteMonth = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid month ID.",
    });
  }

  // Find Month

  const month = await Month.findById(id);

  if (!month) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Month not found.",
    });
  }

  // Delete

  await month.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("months*");
  await deleteCacheByPattern("month*");

  return successResponse(res, {
    message: "Month deleted successfully.",
  });
});