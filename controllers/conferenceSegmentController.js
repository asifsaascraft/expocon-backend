import mongoose from "mongoose";

import ConferenceSegment from "../models/ConferenceSegment.js";

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
// Create Conference Segment
//==============================
export const createConferenceSegment = asyncHandler(async (req, res) => {
  const { conferenceSegmentName } = req.body;

  // Validate

  if (!conferenceSegmentName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Conference segment name is required.",
    });
  }

  // Check Duplicate

  const existingConferenceSegment =
    await ConferenceSegment.findOne({
      conferenceSegmentName:
        conferenceSegmentName.trim(),
    });

  if (existingConferenceSegment) {
    return errorResponse(res, {
      statusCode: 409,
      message:
        "This conference segment name already exists.",
    });
  }

  // Create

  const conferenceSegment =
    await ConferenceSegment.create({
      conferenceSegmentName:
        conferenceSegmentName.trim(),
    });

  // Clear Redis Cache

  await deleteCacheByPattern(
    "conference-segments*",
  );

  return successResponse(res, {
    statusCode: 201,

    message:
      "Conference segment created successfully.",

    data: conferenceSegment,
  });
});

//==============================
// Get Conference Segments
//==============================
export const getConferenceSegments = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } =
    getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "conferenceSegmentName",
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

  const cacheKey = `conference-segments:${JSON.stringify(
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
        "Conference segments fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [conferenceSegments, total] =
    await Promise.all([
      ConferenceSegment.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      ConferenceSegment.countDocuments(query),
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
      data: conferenceSegments,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message:
      "Conference segments fetched successfully.",

    data: conferenceSegments,

    pagination,
  });
});

//==============================
// Get Conference Segment By ID
//==============================
export const getConferenceSegmentById =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid conference segment ID.",
      });
    }

    // Cache Key

    const cacheKey = `conference-segment:${id}`;

    // Check Redis

    const cachedData = await getCache(
      cacheKey,
    );

    if (cachedData) {
      return successResponse(res, {
        message:
          "Conference segment fetched successfully (from cache).",

        data: cachedData,
      });
    }

    // MongoDB

    const conferenceSegment =
      await ConferenceSegment.findById(id);

    if (!conferenceSegment) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Conference segment not found.",
      });
    }

    // Save Cache

    await setCache(
      cacheKey,
      conferenceSegment,
      3600,
    );

    return successResponse(res, {
      message:
        "Conference segment fetched successfully.",

      data: conferenceSegment,
    });
  });

//==============================
// Update Conference Segment
//==============================
export const updateConferenceSegment =
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { conferenceSegmentName } =
      req.body;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid conference segment ID.",
      });
    }

    // Validate

    if (!conferenceSegmentName?.trim()) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Conference segment name is required.",
      });
    }

    // Find Conference Segment

    const conferenceSegment =
      await ConferenceSegment.findById(id);

    if (!conferenceSegment) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Conference segment not found.",
      });
    }

    // Check Duplicate

    const existingConferenceSegment =
      await ConferenceSegment.findOne({
        conferenceSegmentName:
          conferenceSegmentName.trim(),

        _id: {
          $ne: id,
        },
      });

    if (existingConferenceSegment) {
      return errorResponse(res, {
        statusCode: 409,
        message:
          "Conference segment already exists.",
      });
    }

    // Update

    conferenceSegment.conferenceSegmentName =
      conferenceSegmentName.trim();

    await conferenceSegment.save();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "conference-segments*",
    );

    await deleteCacheByPattern(
      "conference-segment*",
    );

    return successResponse(res, {
      message:
        "Conference segment updated successfully.",

      data: conferenceSegment,
    });
  });

//==============================
// Delete Conference Segment
//==============================
export const deleteConferenceSegment =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid conference segment ID.",
      });
    }

    // Find Conference Segment

    const conferenceSegment =
      await ConferenceSegment.findById(id);

    if (!conferenceSegment) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Conference segment not found.",
      });
    }

    // Delete

    await conferenceSegment.deleteOne();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "conference-segments*",
    );

    await deleteCacheByPattern(
      "conference-segment*",
    );

    return successResponse(res, {
      message:
        "Conference segment deleted successfully.",
    });
  });