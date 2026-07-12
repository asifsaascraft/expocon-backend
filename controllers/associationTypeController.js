import mongoose from "mongoose";

import AssociationType from "../models/AssociationType.js";

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
// Create Association Type
//==============================
export const createAssociationType = asyncHandler(async (req, res) => {
  const { associationTypeName } = req.body;

  // Validate

  if (!associationTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Association type name is required.",
    });
  }

  // Check Duplicate

  const existingAssociationType =
    await AssociationType.findOne({
      associationTypeName: associationTypeName.trim(),
    });

  if (existingAssociationType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This association type name already exists.",
    });
  }

  // Create

  const associationType =
    await AssociationType.create({
      associationTypeName:
        associationTypeName.trim(),
    });

  // Clear Redis Cache

  await deleteCacheByPattern(
    "association-types*",
  );

  return successResponse(res, {
    statusCode: 201,

    message:
      "Association type created successfully.",

    data: associationType,
  });
});

//==============================
// Get Association Types
//==============================
export const getAssociationTypes =
  asyncHandler(async (req, res) => {
    // Pagination

    const { page, limit, skip } =
      getPagination(req);

    // Search

    const searchQuery = buildSearchQuery(req, [
      "associationTypeName",
    ]);

    // Filters

    const filtersQuery =
      buildFiltersQuery(req, []);

    // Final Query

    const query = {
      ...searchQuery,
      ...filtersQuery,
    };

    // Sorting

    const sort = buildSortQuery(req);

    // Cache Key

    const cacheKey = `association-types:${JSON.stringify(
      {
        page,
        limit,
        query,
        sort,
      },
    )}`;

    // Check Redis

    const cachedData =
      await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Association types fetched successfully (from cache).",

        data: cachedData.data,

        pagination:
          cachedData.pagination,
      });
    }

    // MongoDB

    const [associationTypes, total] =
      await Promise.all([
        AssociationType.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),

        AssociationType.countDocuments(
          query,
        ),
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
        data: associationTypes,
        pagination,
      },
      3600,
    );

    return successResponse(res, {
      message:
        "Association types fetched successfully.",

      data: associationTypes,

      pagination,
    });
  });

//==============================
// Get Association Type By ID
//==============================
export const getAssociationTypeById =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid association type ID.",
      });
    }

    // Cache Key

    const cacheKey = `association-type:${id}`;

    // Check Redis

    const cachedData =
      await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Association type fetched successfully (from cache).",

        data: cachedData,
      });
    }

    // MongoDB

    const associationType =
      await AssociationType.findById(id);

    if (!associationType) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Association type not found.",
      });
    }

    // Save Cache

    await setCache(
      cacheKey,
      associationType,
      3600,
    );

    return successResponse(res, {
      message:
        "Association type fetched successfully.",

      data: associationType,
    });
  });

//==============================
// Update Association Type
//==============================
export const updateAssociationType =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { associationTypeName } =
      req.body;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid association type ID.",
      });
    }

    // Validate

    if (
      !associationTypeName?.trim()
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Association type name is required.",
      });
    }

    // Find Association Type

    const associationType =
      await AssociationType.findById(id);

    if (!associationType) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Association type not found.",
      });
    }

    // Check Duplicate

    const existingAssociationType =
      await AssociationType.findOne({
        associationTypeName:
          associationTypeName.trim(),
        _id: { $ne: id },
      });

    if (existingAssociationType) {
      return errorResponse(res, {
        statusCode: 409,
        message:
          "Association type already exists.",
      });
    }

    // Update

    associationType.associationTypeName =
      associationTypeName.trim();

    await associationType.save();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "association-types*",
    );

    await deleteCacheByPattern(
      "association-type*",
    );

    return successResponse(res, {
      message:
        "Association type updated successfully.",

      data: associationType,
    });
  });

//==============================
// Delete Association Type
//==============================
export const deleteAssociationType =
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Invalid association type ID.",
      });
    }

    // Find Association Type

    const associationType =
      await AssociationType.findById(id);

    if (!associationType) {
      return errorResponse(res, {
        statusCode: 404,
        message:
          "Association type not found.",
      });
    }

    // Delete

    await associationType.deleteOne();

    // Clear Redis Cache

    await deleteCacheByPattern(
      "association-types*",
    );

    await deleteCacheByPattern(
      "association-type*",
    );

    return successResponse(res, {
      message:
        "Association type deleted successfully.",
    });
  });