import CompanyType from "../../models/CompanyType.js";

import asyncHandler from "../../utils/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../../utils/response.js";

import {
  getCache,
  setCache,
  deleteCacheByPattern,
} from "../../utils/redisCache.js";

// =====================================
// Get All Public Company Types
// =====================================
export const getPublicCompanyTypes = asyncHandler(
  async (req, res) => {
    // =====================================
    // Cache Key
    // =====================================

    const cacheKey = "public-company-types";

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public company types fetched successfully (from cache).",
        data: cachedData,
      });
    }

    // =====================================
    // Get Company Types
    // =====================================

    const companyTypes = await CompanyType.find({})
      .select("_id companyTypeName")
      .sort({ companyTypeName: 1 })
      .lean();

    // =====================================
    // Save Redis Cache
    // =====================================

    await setCache(
      cacheKey,
      companyTypes,
      3600,
    );

    // =====================================
    // Response
    // =====================================

    return successResponse(res, {
      message:
        "Public company types fetched successfully.",
      data: companyTypes,
    });
  },
);

// =====================================
// Clear Public Company Type Cache
// =====================================
export const clearPublicCompanyTypeCache = asyncHandler(
  async (req, res) => {
    await deleteCacheByPattern(
      "public-company-types*",
    );

    return successResponse(res, {
      message:
        "Public company type cache cleared successfully.",
    });
  },
);