import mongoose from "mongoose";

import EntryType from "../models/EntryType.js";

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
// Create Entry Type
//==============================
export const createEntryType = asyncHandler(async (req, res) => {
  const { entryTypeName } = req.body;

  // Validate

  if (!entryTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Entry type name is required.",
    });
  }

  // Check Duplicate

  const existingEntryType = await EntryType.findOne({
    entryTypeName: entryTypeName.trim(),
  });

  if (existingEntryType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This entry type name already exists.",
    });
  }

  // Create

  const entryType = await EntryType.create({
    entryTypeName: entryTypeName.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("entry-types*");

  return successResponse(res, {
    statusCode: 201,

    message: "Entry type created successfully.",

    data: entryType,
  });
});

//==============================
// Get Entry Types
//==============================
export const getEntryTypes = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "entryTypeName",
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

  const cacheKey = `entry-types:${JSON.stringify({
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
        "Entry types fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [entryTypes, total] = await Promise.all([
    EntryType.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    EntryType.countDocuments(query),
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
      data: entryTypes,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Entry types fetched successfully.",

    data: entryTypes,

    pagination,
  });
});

//==============================
// Get Entry Type By ID
//==============================
export const getEntryTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid entry type ID.",
    });
  }

  // Cache Key

  const cacheKey = `entry-type:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Entry type fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const entryType = await EntryType.findById(id);

  if (!entryType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Entry type not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, entryType, 3600);

  return successResponse(res, {
    message: "Entry type fetched successfully.",

    data: entryType,
  });
});

//==============================
// Update Entry Type
//==============================
export const updateEntryType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { entryTypeName } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid entry type ID.",
    });
  }

  // Validate

  if (!entryTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Entry type name is required.",
    });
  }

  // Find Entry Type

  const entryType = await EntryType.findById(id);

  if (!entryType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Entry type not found.",
    });
  }

  // Check Duplicate

  const existingEntryType = await EntryType.findOne({
    entryTypeName: entryTypeName.trim(),
    _id: { $ne: id },
  });

  if (existingEntryType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Entry type already exists.",
    });
  }

  // Update

  entryType.entryTypeName = entryTypeName.trim();

  await entryType.save();

  // Clear Redis Cache

  await deleteCacheByPattern("entry-types*");
  await deleteCacheByPattern("entry-type*");

  return successResponse(res, {
    message: "Entry type updated successfully.",

    data: entryType,
  });
});

//==============================
// Delete Entry Type
//==============================
export const deleteEntryType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid entry type ID.",
    });
  }

  // Find Entry Type

  const entryType = await EntryType.findById(id);

  if (!entryType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Entry type not found.",
    });
  }

  // Delete

  await entryType.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("entry-types*");
  await deleteCacheByPattern("entry-type*");

  return successResponse(res, {
    message: "Entry type deleted successfully.",
  });
});