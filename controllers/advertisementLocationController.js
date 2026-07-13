import mongoose from "mongoose";

import AdvertisementLocation from "../models/AdvertisementLocation.js";

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
// Create Advertisement Location
//==============================
export const createAdvertisementLocation = asyncHandler(async (req, res) => {
  const { advertisementLocationName } = req.body;

  // Validate

  if (!advertisementLocationName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Advertisement Location name is required.",
    });
  }

  // Check Duplicate

  const existingAdvertisementLocation =
    await AdvertisementLocation.findOne({
      advertisementLocationName:
        advertisementLocationName.trim(),
    });

  if (existingAdvertisementLocation) {
    return errorResponse(res, {
      statusCode: 409,
      message:
        "This Advertisement Location name already exists.",
    });
  }

  // Create

  const advertisementLocation =
    await AdvertisementLocation.create({
      advertisementLocationName:
        advertisementLocationName.trim(),
    });

  // Clear Redis Cache

  await deleteCacheByPattern(
    "advertisement-locations*",
  );

  return successResponse(res, {
    statusCode: 201,

    message:
      "Advertisement Location created successfully.",

    data: advertisementLocation,
  });
});

//==============================
// Get Advertisement Locations
//==============================
export const getAdvertisementLocations = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } =
    getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "advertisementLocationName",
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

  const cacheKey = `advertisement-locations:${JSON.stringify(
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
        "Advertisement Locations fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [advertisementLocations, total] =
    await Promise.all([
      AdvertisementLocation.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      AdvertisementLocation.countDocuments(query),
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
      data: advertisementLocations,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message:
      "Advertisement Locations fetched successfully.",

    data: advertisementLocations,

    pagination,
  });
});

//==============================
// Get Advertisement Location By ID
//==============================
export const getAdvertisementLocationById =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid Advertisement Location ID.",
      });
    }

    // Cache Key

    const cacheKey = `advertisement-location:${id}`;

    // Check Redis

    const cachedData = await getCache(
      cacheKey,
    );

    if (cachedData) {
      return successResponse(res, {
        message:
          "Advertisement Location fetched successfully (from cache).",

        data: cachedData,
      });
    }

    // MongoDB

    const advertisementLocation =
      await AdvertisementLocation.findById(id);

    if (!advertisementLocation) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Advertisement Location not found.",
      });
    }

    // Save Cache

    await setCache(
      cacheKey,
      advertisementLocation,
      3600,
    );

    return successResponse(res, {
      message:
        "Advertisement Location fetched successfully.",

      data: advertisementLocation,
    });
  });

//==============================
// Update Advertisement Location
//==============================
export const updateAdvertisementLocation =
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { advertisementLocationName } =
      req.body;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid Advertisement Location ID.",
      });
    }

    // Validate

    if (!advertisementLocationName?.trim()) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Advertisement Location name is required.",
      });
    }

    // Find Advertisement Location

    const advertisementLocation =
      await AdvertisementLocation.findById(id);

    if (!advertisementLocation) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Advertisement Location not found.",
      });
    }

    // Check Duplicate

    const existingAdvertisementLocation =
      await AdvertisementLocation.findOne({
        advertisementLocationName:
          advertisementLocationName.trim(),

        _id: {
          $ne: id,
        },
      });

    if (existingAdvertisementLocation) {
      return errorResponse(res, {
        statusCode: 409,
        message:
          "Advertisement Location already exists.",
      });
    }

    // Update

    advertisementLocation.advertisementLocationName =
      advertisementLocationName.trim();

    await advertisementLocation.save();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "advertisement-locations*",
    );

    await deleteCacheByPattern(
      "advertisement-location*",
    );

    return successResponse(res, {
      message:
        "Advertisement Location updated successfully.",

      data: advertisementLocation,
    });
  });

//==============================
// Delete Advertisement Location
//==============================
export const deleteAdvertisementLocation =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid Advertisement Location ID.",
      });
    }

    // Find Advertisement Location

    const advertisementLocation =
      await AdvertisementLocation.findById(id);

    if (!advertisementLocation) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Advertisement Location not found.",
      });
    }

    // Delete

    await advertisementLocation.deleteOne();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "advertisement-locations*",
    );

    await deleteCacheByPattern(
      "advertisement-location*",
    );

    return successResponse(res, {
      message:
        "Advertisement Location deleted successfully.",
    });
  });