import mongoose from "mongoose";

import State from "../models/State.js";

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
// Create State
//==============================
export const createState = asyncHandler(async (req, res) => {
  const { state } = req.body;

  // Validate

  if (!state?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "State is required.",
    });
  }

  // Check Duplicate

  const existingState = await State.findOne({
    state: state.trim(),
  });

  if (existingState) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This state already exists.",
    });
  }

  // Create

  const newState = await State.create({
    state: state.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("states*");

  return successResponse(res, {
    statusCode: 201,

    message: "State created successfully.",

    data: newState,
  });
});

//==============================
// Get States
//==============================
export const getStates = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "state",
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

  const cacheKey = `states:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "States fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [states, total] = await Promise.all([
    State.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    State.countDocuments(query),
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
      data: states,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "States fetched successfully.",

    data: states,

    pagination,
  });
});

//==============================
// Get State By ID
//==============================
export const getStateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Cache Key

  const cacheKey = `state:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "State fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const state = await State.findById(id);

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, state, 3600);

  return successResponse(res, {
    message: "State fetched successfully.",

    data: state,
  });
});

//==============================
// Update State
//==============================
export const updateState = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { state } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Validate

  if (!state?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "State is required.",
    });
  }

  // Find State

  const existingState = await State.findById(id);

  if (!existingState) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  // Check Duplicate

  const duplicateState = await State.findOne({
    state: state.trim(),
    _id: { $ne: id },
  });

  if (duplicateState) {
    return errorResponse(res, {
      statusCode: 409,
      message: "State already exists.",
    });
  }

  // Update

  existingState.state = state.trim();

  await existingState.save();

  // Clear Redis Cache

  await deleteCacheByPattern("states*");
  await deleteCacheByPattern("state*");

  return successResponse(res, {
    message: "State updated successfully.",

    data: existingState,
  });
});

//==============================
// Delete State
//==============================
export const deleteState = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Find State

  const state = await State.findById(id);

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  // Delete

  await state.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("states*");
  await deleteCacheByPattern("state*");

  return successResponse(res, {
    message: "State deleted successfully.",
  });
});