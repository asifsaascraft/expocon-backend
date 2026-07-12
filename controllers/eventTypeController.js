import mongoose from "mongoose";

import EventType from "../models/EventType.js";

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
// Create Event Type
//==============================
export const createEventType = asyncHandler(async (req, res) => {
  const { eventTypeName } = req.body;

  // Validate

  if (!eventTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Event type name is required.",
    });
  }

  // Check Duplicate

  const existingEventType = await EventType.findOne({
    eventTypeName: eventTypeName.trim(),
  });

  if (existingEventType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This event type name already exists.",
    });
  }

  // Create

  const eventType = await EventType.create({
    eventTypeName: eventTypeName.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("event-types*");

  return successResponse(res, {
    statusCode: 201,

    message: "Event type created successfully.",

    data: eventType,
  });
});

//==============================
// Get Event Types
//==============================
export const getEventTypes = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "eventTypeName",
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

  const cacheKey = `event-types:${JSON.stringify({
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
        "Event types fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [eventTypes, total] = await Promise.all([
    EventType.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    EventType.countDocuments(query),
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
      data: eventTypes,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Event types fetched successfully.",

    data: eventTypes,

    pagination,
  });
});

//==============================
// Get Event Type By ID
//==============================
export const getEventTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid event type ID.",
    });
  }

  // Cache Key

  const cacheKey = `event-type:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Event type fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const eventType = await EventType.findById(id);

  if (!eventType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Event type not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, eventType, 3600);

  return successResponse(res, {
    message: "Event type fetched successfully.",

    data: eventType,
  });
});

//==============================
// Update Event Type
//==============================
export const updateEventType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { eventTypeName } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid event type ID.",
    });
  }

  // Validate

  if (!eventTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Event type name is required.",
    });
  }

  // Find Event Type

  const eventType = await EventType.findById(id);

  if (!eventType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Event type not found.",
    });
  }

  // Check Duplicate

  const existingEventType = await EventType.findOne({
    eventTypeName: eventTypeName.trim(),
    _id: { $ne: id },
  });

  if (existingEventType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Event type already exists.",
    });
  }

  // Update

  eventType.eventTypeName = eventTypeName.trim();

  await eventType.save();

  // Clear Redis Cache

  await deleteCacheByPattern("event-types*");
  await deleteCacheByPattern("event-type*");

  return successResponse(res, {
    message: "Event type updated successfully.",

    data: eventType,
  });
});

//==============================
// Delete Event Type
//==============================
export const deleteEventType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid event type ID.",
    });
  }

  // Find Event Type

  const eventType = await EventType.findById(id);

  if (!eventType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Event type not found.",
    });
  }

  // Delete

  await eventType.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("event-types*");
  await deleteCacheByPattern("event-type*");

  return successResponse(res, {
    message: "Event type deleted successfully.",
  });
});