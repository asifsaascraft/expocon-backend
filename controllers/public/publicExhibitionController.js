import mongoose from "mongoose";

import Exhibition from "../../models/Exhibition.js";

import asyncHandler from "../../utils/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../../utils/response.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../utils/pagination.js";

import {
  getCache,
  setCache,
  deleteCacheByPattern,
} from "../../utils/redisCache.js";

// =====================================
// Get All Public Exhibitions
// =====================================
export const getPublicExhibitions = asyncHandler(
  async (req, res) => {
    // =====================================
    // Pagination
    // =====================================

    const { page, limit, skip } = getPagination(req);

    // =====================================
    // Query Parameters
    // =====================================

    const {
      search,
      city,
      stateId,
      featured,
      sortBy = "startDate",
      order = "asc",
    } = req.query;

    // =====================================
    // Build Query
    // =====================================

    const query = {
      status: "approved",
    };

    // =====================================
    // Search
    // =====================================

    if (search?.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i",
      );

      query.$or = [
        {
          eventName: searchRegex,
        },
        {
          city: searchRegex,
        },
      ];
    }

    // =====================================
    // City Filter
    // =====================================

    if (city?.trim()) {
      query.city = new RegExp(
        `^${city.trim()}$`,
        "i",
      );
    }

    // =====================================
    // State Filter
    // =====================================

    if (stateId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          stateId,
        )
      ) {
        return errorResponse(res, {
          statusCode: 400,
          message: "Invalid state ID.",
        });
      }

      query.stateId = stateId;
    }

    // =====================================
    // Featured Filter
    // =====================================

    if (featured !== undefined) {
      if (featured === "true") {
        query.featured = true;
      }

      if (featured === "false") {
        query.featured = false;
      }
    }

    // =====================================
    // Validate Sort
    // =====================================

    const allowedSortFields = [
      "startDate",
      "endDate",
      "eventName",
      "city",
      "featured",
      "createdAt",
    ];

    const safeSortBy =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "startDate";

    const safeOrder =
      order === "desc" ? -1 : 1;

    // =====================================
    // Sorting
    // =====================================
    //
    // Featured exhibitions always appear first.
    //
    // Example:
    //
    // Featured
    // Featured
    // Featured
    // Normal
    // Normal
    // Normal
    //
    // Inside each group, sort according
    // to the requested field.
    // =====================================

    let sort;

    if (safeSortBy === "featured") {
      sort = {
        featured: -1,
        startDate: 1,
      };
    } else {
      sort = {
        featured: -1,
        [safeSortBy]: safeOrder,
      };
    }

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey =
      `public-exhibitions:${JSON.stringify({
        page,
        limit,
        search: search?.trim() || "",
        city: city?.trim() || "",
        stateId: stateId || "",
        featured:
          featured !== undefined
            ? featured
            : "",
        sortBy: safeSortBy,
        order: safeOrder,
      })}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData =
      await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public exhibitions fetched successfully (from cache).",

        data: cachedData.data,

        pagination:
          cachedData.pagination,
      });
    }

    // =====================================
    // Get Exhibitions
    // =====================================

    const [exhibitions, total] =
      await Promise.all([
        Exhibition.find(query)

          // =====================================
          // Only Fields Needed From Exhibition
          // =====================================

          .select(
            "_id eventName startDate endDate city stateId companyId uploadEventLogo featured",
          )

          // =====================================
          // Populate Exhibition State
          // =====================================

          .populate({
            path: "stateId",
            select: "_id state",
          })

          // =====================================
          // Populate Organizer / Company
          // =====================================

          .populate({
            path: "companyId",
            select:
              "_id companyName stateId city address",

            // =====================================
            // Populate Company's State
            // =====================================

            populate: {
              path: "stateId",
              select: "_id state",
            },
          })

          // =====================================
          // Sort
          // =====================================

          .sort(sort)

          // =====================================
          // Pagination
          // =====================================

          .skip(skip)
          .limit(limit)

          .lean(),

        Exhibition.countDocuments(query),
      ]);

    // =====================================
    // Pagination Metadata
    // =====================================

    const pagination =
      buildPaginationMeta(
        total,
        page,
        limit,
      );

    // =====================================
    // Build Public Response
    // =====================================

    const publicExhibitions =
      exhibitions.map((exhibition) => ({
        _id: exhibition._id,

        eventName:
          exhibition.eventName,

        startDate:
          exhibition.startDate,

        endDate:
          exhibition.endDate,

        organizer:
          exhibition.companyId
            ? {
                _id:
                  exhibition.companyId._id,

                companyName:
                  exhibition.companyId
                    .companyName,

                state:
                  exhibition.companyId
                    .stateId
                    ? {
                        _id:
                          exhibition.companyId
                            .stateId._id,

                        state:
                          exhibition.companyId
                            .stateId.state,
                      }
                    : null,

                city:
                  exhibition.companyId.city,

                address:
                  exhibition.companyId.address,
              }
            : null,

        city:
          exhibition.city,

        state:
          exhibition.stateId
            ? {
                _id:
                  exhibition.stateId._id,

                state:
                  exhibition.stateId.state,
              }
            : null,

        uploadEventLogo:
          exhibition.uploadEventLogo,

        featured:
          exhibition.featured,
      }));

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: publicExhibitions,

      pagination,
    };

    // =====================================
    // Save Redis Cache
    // =====================================

    await setCache(
      cacheKey,
      responseData,
      3600,
    );

    // =====================================
    // Response
    // =====================================

    return successResponse(res, {
      message:
        "Public exhibitions fetched successfully.",

      data: publicExhibitions,

      pagination,
    });
  },
);

// =====================================
// Clear Public Exhibition Cache
// =====================================
export const clearPublicExhibitionCache =
  asyncHandler(async (req, res) => {
    await deleteCacheByPattern(
      "public-exhibitions*",
    );

    return successResponse(res, {
      message:
        "Public exhibition cache cleared successfully.",
    });
  });