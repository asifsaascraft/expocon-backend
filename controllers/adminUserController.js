import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  successResponse,
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
} from "../utils/redisCache.js";

//==============================
// Get All Users
//==============================
export const getAllUsers = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "fullName",
    "username",
    "email",
    "mobile",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
  ]);

  // Final Query

  const query = {
    role: "user",

    isDeleted: false,

    ...searchQuery,

    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache Key

  const cacheKey = `admin-users:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // Redis

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Users fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // Database

  const [users, total] = await Promise.all([
    User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    User.countDocuments(query),
  ]);

  const pagination = buildPaginationMeta(
    total,
    page,
    limit,
  );

  // Cache

  await setCache(
    cacheKey,
    {
      data: users,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Users fetched successfully.",

    data: users,

    pagination,
  });
});

//==============================
// Get All Staffs
//==============================
export const getAllStaffs = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "fullName",
    "username",
    "email",
    "mobile",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
  ]);

  // Final Query

  const query = {
    role: "staff",

    isDeleted: false,

    ...searchQuery,

    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache

  const cacheKey = `admin-staffs:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Staffs fetched successfully (from cache).",

      data: cachedData.data,

      pagination: cachedData.pagination,
    });
  }

  // Database

  const [staffs, total] = await Promise.all([
    User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    User.countDocuments(query),
  ]);

  const pagination = buildPaginationMeta(
    total,
    page,
    limit,
  );

  // Cache

  await setCache(
    cacheKey,
    {
      data: staffs,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Staffs fetched successfully.",

    data: staffs,

    pagination,
  });
});