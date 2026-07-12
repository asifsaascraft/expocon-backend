import mongoose from "mongoose";

import ConferenceType from "../models/ConferenceType.js";

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
// Create Conference Type
//==============================
export const createConferenceType = asyncHandler(async (req, res) => {
  const { conferenceTypeName } = req.body;

  // Validate

  if (!conferenceTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Conference type name is required.",
    });
  }

  // Check Duplicate

  const existingConferenceType =
    await ConferenceType.findOne({
      conferenceTypeName:
        conferenceTypeName.trim(),
    });

  if (existingConferenceType) {
    return errorResponse(res, {
      statusCode: 409,
      message:
        "This conference type name already exists.",
    });
  }

  // Create

  const conferenceType =
    await ConferenceType.create({
      conferenceTypeName:
        conferenceTypeName.trim(),
    });

  // Clear Redis Cache

  await deleteCacheByPattern(
    "conference-types*",
  );

  return successResponse(res, {
    statusCode: 201,

    message:
      "Conference type created successfully.",

    data: conferenceType,
  });
});

//==============================
// Get Conference Types
//==============================
export const getConferenceTypes = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } =
    getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "conferenceTypeName",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(
    req,
    [],
  );

  // Final Query

  const query = {
    ...searchQuery,
    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache Key

  const cacheKey = `conference-types:${JSON.stringify(
    {
      page,
      limit,
      query,
      sort,
    },
  )}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Conference types fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [conferenceTypes, total] =
    await Promise.all([
      ConferenceType.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      ConferenceType.countDocuments(query),
    ]);

  const pagination =
    buildPaginationMeta(
      total,
      page,
      limit,
    );

  // Save Cache

  await setCache(
    cacheKey,
    {
      data: conferenceTypes,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message:
      "Conference types fetched successfully.",

    data: conferenceTypes,

    pagination,
  });
});

//==============================
// Get Conference Type By ID
//==============================
export const getConferenceTypeById =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid conference type ID.",
      });
    }

    // Cache Key

    const cacheKey = `conference-type:${id}`;

    // Check Redis

    const cachedData = await getCache(
      cacheKey,
    );

    if (cachedData) {
      return successResponse(res, {
        message:
          "Conference type fetched successfully (from cache).",

        data: cachedData,
      });
    }

    // MongoDB

    const conferenceType =
      await ConferenceType.findById(id);

    if (!conferenceType) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Conference type not found.",
      });
    }

    // Save Cache

    await setCache(
      cacheKey,
      conferenceType,
      3600,
    );

    return successResponse(res, {
      message:
        "Conference type fetched successfully.",

      data: conferenceType,
    });
  });

//==============================
// Update Conference Type
//==============================
export const updateConferenceType =
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { conferenceTypeName } =
      req.body;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid conference type ID.",
      });
    }

    // Validate

    if (!conferenceTypeName?.trim()) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Conference type name is required.",
      });
    }

    // Find Conference Type

    const conferenceType =
      await ConferenceType.findById(id);

    if (!conferenceType) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Conference type not found.",
      });
    }

    // Check Duplicate

    const existingConferenceType =
      await ConferenceType.findOne({
        conferenceTypeName:
          conferenceTypeName.trim(),

        _id: {
          $ne: id,
        },
      });

    if (existingConferenceType) {
      return errorResponse(res, {
        statusCode: 409,
        message:
          "Conference type already exists.",
      });
    }

    // Update

    conferenceType.conferenceTypeName =
      conferenceTypeName.trim();

    await conferenceType.save();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "conference-types*",
    );

    await deleteCacheByPattern(
      "conference-type*",
    );

    return successResponse(res, {
      message:
        "Conference type updated successfully.",

      data: conferenceType,
    });
  });

//==============================
// Delete Conference Type
//==============================
export const deleteConferenceType =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid conference type ID.",
      });
    }

    // Find Conference Type

    const conferenceType =
      await ConferenceType.findById(id);

    if (!conferenceType) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Conference type not found.",
      });
    }

    // Delete

    await conferenceType.deleteOne();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "conference-types*",
    );

    await deleteCacheByPattern(
      "conference-type*",
    );

    return successResponse(res, {
      message:
        "Conference type deleted successfully.",
    });
  });