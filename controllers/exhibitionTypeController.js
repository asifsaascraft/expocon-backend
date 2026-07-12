import mongoose from "mongoose";

import ExhibitionType from "../models/ExhibitionType.js";

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
// Create Exhibition Type
//==============================
export const createExhibitionType = asyncHandler(async (req, res) => {
  const { exhibitionTypeName } = req.body;

  // Validate

  if (!exhibitionTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Exhibition type name is required.",
    });
  }

  // Check Duplicate

  const existingExhibitionType =
    await ExhibitionType.findOne({
      exhibitionTypeName: exhibitionTypeName.trim(),
    });

  if (existingExhibitionType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This exhibition type name already exists.",
    });
  }

  // Create

  const exhibitionType =
    await ExhibitionType.create({
      exhibitionTypeName: exhibitionTypeName.trim(),
    });

  // Clear Redis Cache

  await deleteCacheByPattern("exhibition-types*");

  return successResponse(res, {
    statusCode: 201,

    message: "Exhibition type created successfully.",

    data: exhibitionType,
  });
});

//==============================
// Get Exhibition Types
//==============================
export const getExhibitionTypes = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "exhibitionTypeName",
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

  const cacheKey = `exhibition-types:${JSON.stringify({
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
        "Exhibition types fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [exhibitionTypes, total] = await Promise.all([
    ExhibitionType.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    ExhibitionType.countDocuments(query),
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
      data: exhibitionTypes,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Exhibition types fetched successfully.",

    data: exhibitionTypes,

    pagination,
  });
});

//==============================
// Get Exhibition Type By ID
//==============================
export const getExhibitionTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition type ID.",
    });
  }

  // Cache Key

  const cacheKey = `exhibition-type:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Exhibition type fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const exhibitionType = await ExhibitionType.findById(id);

  if (!exhibitionType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition type not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, exhibitionType, 3600);

  return successResponse(res, {
    message: "Exhibition type fetched successfully.",

    data: exhibitionType,
  });
});

//==============================
// Update Exhibition Type
//==============================
export const updateExhibitionType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { exhibitionTypeName } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition type ID.",
    });
  }

  // Validate

  if (!exhibitionTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Exhibition type name is required.",
    });
  }

  // Find Exhibition Type

  const exhibitionType = await ExhibitionType.findById(id);

  if (!exhibitionType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition type not found.",
    });
  }

  // Check Duplicate

  const existingExhibitionType =
    await ExhibitionType.findOne({
      exhibitionTypeName: exhibitionTypeName.trim(),
      _id: { $ne: id },
    });

  if (existingExhibitionType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Exhibition type already exists.",
    });
  }

  // Update

  exhibitionType.exhibitionTypeName =
    exhibitionTypeName.trim();

  await exhibitionType.save();

  // Clear Redis Cache

  await deleteCacheByPattern("exhibition-types*");
  await deleteCacheByPattern("exhibition-type*");

  return successResponse(res, {
    message: "Exhibition type updated successfully.",

    data: exhibitionType,
  });
});

//==============================
// Delete Exhibition Type
//==============================
export const deleteExhibitionType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition type ID.",
    });
  }

  // Find Exhibition Type

  const exhibitionType = await ExhibitionType.findById(id);

  if (!exhibitionType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition type not found.",
    });
  }

  // Delete

  await exhibitionType.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("exhibition-types*");
  await deleteCacheByPattern("exhibition-type*");

  return successResponse(res, {
    message: "Exhibition type deleted successfully.",
  });
});