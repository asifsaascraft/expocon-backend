import mongoose from "mongoose";
import CompanyType from "../models/CompanyType.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";
import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";
import {
  getCache,
  setCache,
  deleteCacheByPattern,
} from "../utils/redisCache.js";

//==============================
// Create Company Type
//==============================
export const createCompanyType = asyncHandler(async (req, res) => {
  const { companyTypeName } = req.body;

  // Validate

  if (!companyTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Company type name is required.",
    });
  }

  // Check Duplicate

  const existingCompanyType = await CompanyType.findOne({
    companyTypeName: companyTypeName.trim(),
  });

  if (existingCompanyType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "This Company type name already exists.",
    });
  }

  // Create

  const companyType = await CompanyType.create({
    companyTypeName: companyTypeName.trim(),
  });

  // Clear Redis Cache

  await deleteCacheByPattern("company-types*");

  return successResponse(res, {
    statusCode: 201,

    message: "Company type created successfully.",

    data: companyType,
  });
});

//==============================
// Get Company Types
//==============================
export const getCompanyTypes = asyncHandler(async (req, res) => {
  // Pagination
  const { page, limit, skip } = getPagination(req);

  // Search
  const searchQuery = buildSearchQuery(req, ["companyTypeName"]);

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
  const cacheKey = `company-types:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // ==========================
  // Check Redis Cache
  // ==========================

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Company types fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // ==========================
  // MongoDB
  // ==========================

  const [companyTypes, total] = await Promise.all([
    CompanyType.find(query).sort(sort).skip(skip).limit(limit),

    CompanyType.countDocuments(query),
  ]);

  const pagination = buildPaginationMeta(total, page, limit);

  // ==========================
  // Save into Redis
  // ==========================

  await setCache(
    cacheKey,
    {
      data: companyTypes,
      pagination,
    },
    3600, // 1 hour
  );

  return successResponse(res, {
    message: "Company types fetched successfully.",

    data: companyTypes,

    pagination,
  });
});

//==============================
// Get Company Type By ID
//==============================
export const getCompanyTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company type ID.",
    });
  }

  // Cache Key

  const cacheKey = `company-type:${id}`;

  // Check Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Company type fetched successfully (from cache).",

      data: cachedData,
    });
  }

  // MongoDB

  const companyType = await CompanyType.findById(id);

  if (!companyType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company type not found.",
    });
  }

  // Save Cache

  await setCache(cacheKey, companyType, 3600);

  return successResponse(res, {
    message: "Company type fetched successfully.",

    data: companyType,
  });
});

//==============================
// Update Company Type
//==============================
export const updateCompanyType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { companyTypeName } = req.body;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company type ID.",
    });
  }

  // Validate

  if (!companyTypeName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Company type name is required.",
    });
  }

  // Find Company Type

  const companyType = await CompanyType.findById(id);

  if (!companyType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company type not found.",
    });
  }

  // Check Duplicate

  const existingCompanyType = await CompanyType.findOne({
    companyTypeName: companyTypeName.trim(),
    _id: { $ne: id },
  });

  if (existingCompanyType) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Company type already exists.",
    });
  }

  // Update

  companyType.companyTypeName = companyTypeName.trim();

  await companyType.save();

  // Clear Redis Cache
  await deleteCacheByPattern("company-types*");
  await deleteCacheByPattern("company-type*");

  return successResponse(res, {
    message: "Company type updated successfully.",

    data: companyType,
  });
});

//==============================
// Delete Company Type
//==============================
export const deleteCompanyType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company type ID.",
    });
  }

  // Find Company Type

  const companyType = await CompanyType.findById(id);

  if (!companyType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company type not found.",
    });
  }

  // Delete

  await companyType.deleteOne();

  // Clear Redis Cache
  await deleteCacheByPattern("company-types*");
  await deleteCacheByPattern("company-type*");

  return successResponse(res, {
    message: "Company type deleted successfully.",
  });
});
