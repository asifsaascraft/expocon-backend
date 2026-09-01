import mongoose from "mongoose";

import Conference from "../../models/Conference.js";

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
// Get All Public Conferences
// =====================================
export const getPublicConferences = asyncHandler(
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
          conferenceName: searchRegex,
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
      "conferenceName",
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
    // Featured conferences always appear first.
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
      `public-conferences:${JSON.stringify({
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
          "Public conferences fetched successfully (from cache).",

        data: cachedData.data,

        pagination:
          cachedData.pagination,
      });
    }

    // =====================================
    // Get Conferences
    // =====================================

    const [conferences, total] =
      await Promise.all([
        Conference.find(query)

          // =====================================
          // Only Fields Needed From Conference
          // =====================================

          .select(
            "_id conferenceName conferenceShortName startDate endDate city stateId companyId uploadConferenceLogo featured",
          )

          // =====================================
          // Populate Conference State
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

        Conference.countDocuments(query),
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

    const publicConferences =
      conferences.map((conference) => ({
        _id:
          conference._id,

        conferenceName:
          conference.conferenceName,

        conferenceShortName:
          conference.conferenceShortName,

        startDate:
          conference.startDate,

        endDate:
          conference.endDate,

        organizer:
          conference.companyId
            ? {
                _id:
                  conference.companyId._id,

                companyName:
                  conference.companyId
                    .companyName,

                state:
                  conference.companyId
                    .stateId
                    ? {
                        _id:
                          conference.companyId
                            .stateId._id,

                        state:
                          conference.companyId
                            .stateId.state,
                      }
                    : null,

                city:
                  conference.companyId.city,

                address:
                  conference.companyId.address,
              }
            : null,

        city:
          conference.city,

        state:
          conference.stateId
            ? {
                _id:
                  conference.stateId._id,

                state:
                  conference.stateId.state,
              }
            : null,

        uploadConferenceLogo:
          conference.uploadConferenceLogo,

        featured:
          conference.featured,
      }));

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: publicConferences,

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
        "Public conferences fetched successfully.",

      data: publicConferences,

      pagination,
    });
  },
);

// =====================================
// Clear Public Conference Cache
// =====================================
export const clearPublicConferenceCache =
  asyncHandler(async (req, res) => {
    await deleteCacheByPattern(
      "public-conferences*",
    );

    return successResponse(res, {
      message:
        "Public conference cache cleared successfully.",
    });
  });