import mongoose from "mongoose";

import JobType from "../models/JobType.js";

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
// Create Job Type
//==============================
export const createJobType = asyncHandler(async (req, res) => {
  const { jobTypeName } = req.body;

  // Validate

  if (!jobTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Job type name is required.",
    });
  }

  // Check Duplicate

  const existingJobType = await JobType.findOne({
    jobTypeName: jobTypeName.trim(),
  });

  if (existingJobType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This job type name already exists.",
    });
  }

  // Create

  const jobType = await JobType.create({
    jobTypeName: jobTypeName.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("job-types*");

  return successResponse(res, {
    statusCode: 201,

    message: "Job type created successfully.",

    data: jobType,
  });
});

//==============================
// Get Job Types
//==============================
export const getJobTypes = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "jobTypeName",
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

  const cacheKey = `job-types:${JSON.stringify({
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
        "Job types fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [jobTypes, total] = await Promise.all([
    JobType.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    JobType.countDocuments(query),
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
      data: jobTypes,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Job types fetched successfully.",

    data: jobTypes,

    pagination,
  });
});

//==============================
// Get Job Type By ID
//==============================
export const getJobTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid job type ID.",
    });
  }

  // Cache Key

  const cacheKey = `job-type:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Job type fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const jobType = await JobType.findById(id);

  if (!jobType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Job type not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, jobType, 3600);

  return successResponse(res, {
    message: "Job type fetched successfully.",

    data: jobType,
  });
});

//==============================
// Update Job Type
//==============================
export const updateJobType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { jobTypeName } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid job type ID.",
    });
  }

  // Validate

  if (!jobTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Job type name is required.",
    });
  }

  // Find Job Type

  const jobType = await JobType.findById(id);

  if (!jobType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Job type not found.",
    });
  }

  // Check Duplicate

  const existingJobType = await JobType.findOne({
    jobTypeName: jobTypeName.trim(),
    _id: { $ne: id },
  });

  if (existingJobType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Job type already exists.",
    });
  }

  // Update

  jobType.jobTypeName = jobTypeName.trim();

  await jobType.save();

  // Clear Redis Cache

  await deleteCacheByPattern("job-types*");
  await deleteCacheByPattern("job-type*");

  return successResponse(res, {
    message: "Job type updated successfully.",

    data: jobType,
  });
});

//==============================
// Delete Job Type
//==============================
export const deleteJobType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid job type ID.",
    });
  }

  // Find Job Type

  const jobType = await JobType.findById(id);

  if (!jobType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Job type not found.",
    });
  }

  // Delete

  await jobType.deleteOne();

  // Clear Redis Cache

  await deleteCacheByPattern("job-types*");
  await deleteCacheByPattern("job-type*");

  return successResponse(res, {
    message: "Job type deleted successfully.",
  });
});