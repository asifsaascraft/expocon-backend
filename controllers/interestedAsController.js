import mongoose from "mongoose";

import InterestedAs from "../models/InterestedAs.js";

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
// Create Interested As
//==============================
export const createInterestedAs = asyncHandler(async (req, res) => {
  const { interestedAsName } = req.body;

  // Validate

  if (!interestedAsName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Interested As name is required.",
    });
  }

  // Check Duplicate

  const existingInterestedAs = await InterestedAs.findOne({
    interestedAsName: interestedAsName.trim(),
  });

  if (existingInterestedAs) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This Interested As name already exists.",
    });
  }

  // Create

  const interestedAs = await InterestedAs.create({
    interestedAsName: interestedAsName.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("interested-as*");

  return successResponse(res, {
    statusCode: 201,

    message: "Interested As created successfully.",

    data: interestedAs,
  });
});

//==============================
// Get Interested As
//==============================
export const getInterestedAs = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "interestedAsName",
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

  const cacheKey = `interested-as:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Interested As fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [interestedAsList, total] = await Promise.all([
    InterestedAs.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    InterestedAs.countDocuments(query),
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
      data: interestedAsList,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Interested As fetched successfully.",

    data: interestedAsList,

    pagination,
  });
});

//==============================
// Get Interested As By ID
//==============================
export const getInterestedAsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid Interested As ID.",
    });
  }

  // Cache Key

  const cacheKey = `interested-as:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Interested As fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const interestedAs = await InterestedAs.findById(id);

  if (!interestedAs) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Interested As not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, interestedAs, 3600);

  return successResponse(res, {
    message: "Interested As fetched successfully.",

    data: interestedAs,
  });
});

//==============================
// Update Interested As
//==============================
export const updateInterestedAs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { interestedAsName } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid Interested As ID.",
    });
  }

  // Validate

  if (!interestedAsName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Interested As name is required.",
    });
  }

  // Find Interested As

  const interestedAs = await InterestedAs.findById(id);

  if (!interestedAs) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Interested As not found.",
    });
  }

  // Check Duplicate

  const existingInterestedAs = await InterestedAs.findOne({
    interestedAsName: interestedAsName.trim(),
    _id: { $ne: id },
  });

  if (existingInterestedAs) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Interested As already exists.",
    });
  }

  // Update

  interestedAs.interestedAsName = interestedAsName.trim();

  await interestedAs.save();

  // Clear Redis Cache

  await deleteCacheByPattern("interested-as*");
  await deleteCacheByPattern("interested-a*");

  return successResponse(res, {
    message: "Interested As updated successfully.",

    data: interestedAs,
  });
});

//==============================
// Delete Interested As
//==============================
export const deleteInterestedAs = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid Interested As ID.",
    });
  }

  // Find Interested As

  const interestedAs = await InterestedAs.findById(id);

  if (!interestedAs) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Interested As not found.",
    });
  }

  // Delete

  await interestedAs.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("interested-as*");
  await deleteCacheByPattern("interested-a*");

  return successResponse(res, {
    message: "Interested As deleted successfully.",
  });
});