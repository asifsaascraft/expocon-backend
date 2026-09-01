import State from "../../models/State.js";
import Venue from "../../models/Venue.js";
import Conference from "../../models/Conference.js";
import Exhibition from "../../models/Exhibition.js";

import asyncHandler from "../../utils/asyncHandler.js";

import {
  successResponse,
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
// Get Public States With Venue Count
// =====================================
export const getPublicStatesWithVenueCount = asyncHandler(
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
      sortBy = "venueCount",
      order = "desc",
    } = req.query;

    // =====================================
    // Validate Sort
    // =====================================

    const allowedSortFields = [
      "venueCount",
      "state",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "venueCount";

    const safeOrder = order === "asc" ? 1 : -1;

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey = `public-states-venue-count:${JSON.stringify({
      page,
      limit,
      search: search?.trim() || "",
      sortBy: safeSortBy,
      order: safeOrder,
    })}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public states with venue count fetched successfully (from cache).",
        data: cachedData.data,
        pagination: cachedData.pagination,
      });
    }

    // =====================================
    // Build State Match
    // =====================================

    const stateMatch = {};

    if (search?.trim()) {
      stateMatch.state = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // =====================================
    // Aggregation
    // =====================================

    const aggregation = [
      // -------------------------------------
      // Search State
      // -------------------------------------

      {
        $match: stateMatch,
      },

      // -------------------------------------
      // Lookup Approved Venues
      // -------------------------------------

      {
        $lookup: {
          from: Venue.collection.name,

          let: {
            stateId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$stateId", "$$stateId"],
                    },
                    {
                      $eq: ["$status", "approved"],
                    },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],

          as: "venueCountData",
        },
      },

      // -------------------------------------
      // Convert Count Array To Number
      // -------------------------------------

      {
        $addFields: {
          venueCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$venueCountData.count",
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // -------------------------------------
      // Only Required Response Fields
      // -------------------------------------

      {
        $project: {
          _id: 0,
          state: 1,
          venueCount: 1,
        },
      },

      // -------------------------------------
      // Sorting
      // -------------------------------------

      {
        $sort:
          safeSortBy === "venueCount"
            ? {
                venueCount: safeOrder,
                state: 1,
              }
            : {
                state: safeOrder,
                venueCount: -1,
              },
      },

      // -------------------------------------
      // Pagination
      // -------------------------------------

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },

            {
              $limit: limit,
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    // =====================================
    // Execute Aggregation
    // =====================================

    const [result] = await State.aggregate(aggregation);

    const states = result?.data || [];

    const total = result?.total?.[0]?.count || 0;

    // =====================================
    // Pagination Metadata
    // =====================================

    const pagination = buildPaginationMeta(
      total,
      page,
      limit,
    );

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: states,
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
        "Public states with venue count fetched successfully.",
      data: states,
      pagination,
    });
  },
);


// =====================================
// Get Public States With Conference Count
// =====================================
export const getPublicStatesWithConferenceCount = asyncHandler(
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
      sortBy = "conferenceCount",
      order = "desc",
    } = req.query;

    // =====================================
    // Validate Sort
    // =====================================

    const allowedSortFields = [
      "conferenceCount",
      "state",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "conferenceCount";

    const safeOrder = order === "asc" ? 1 : -1;

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey = `public-states-conference-count:${JSON.stringify({
      page,
      limit,
      search: search?.trim() || "",
      sortBy: safeSortBy,
      order: safeOrder,
    })}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public states with conference count fetched successfully (from cache).",
        data: cachedData.data,
        pagination: cachedData.pagination,
      });
    }

    // =====================================
    // Build State Match
    // =====================================

    const stateMatch = {};

    if (search?.trim()) {
      stateMatch.state = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // =====================================
    // Aggregation
    // =====================================

    const aggregation = [
      // -------------------------------------
      // Search State
      // -------------------------------------

      {
        $match: stateMatch,
      },

      // -------------------------------------
      // Lookup Approved Conferences
      // -------------------------------------

      {
        $lookup: {
          from: Conference.collection.name,

          let: {
            stateId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$stateId", "$$stateId"],
                    },
                    {
                      $eq: ["$status", "approved"],
                    },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],

          as: "conferenceCountData",
        },
      },

      // -------------------------------------
      // Convert Count Array To Number
      // -------------------------------------

      {
        $addFields: {
          conferenceCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$conferenceCountData.count",
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // -------------------------------------
      // Only Required Response Fields
      // -------------------------------------

      {
        $project: {
          _id: 0,
          state: 1,
          conferenceCount: 1,
        },
      },

      // -------------------------------------
      // Sorting
      // -------------------------------------

      {
        $sort:
          safeSortBy === "conferenceCount"
            ? {
                conferenceCount: safeOrder,
                state: 1,
              }
            : {
                state: safeOrder,
                conferenceCount: -1,
              },
      },

      // -------------------------------------
      // Pagination
      // -------------------------------------

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },

            {
              $limit: limit,
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    // =====================================
    // Execute Aggregation
    // =====================================

    const [result] = await State.aggregate(aggregation);

    const states = result?.data || [];

    const total = result?.total?.[0]?.count || 0;

    // =====================================
    // Pagination Metadata
    // =====================================

    const pagination = buildPaginationMeta(
      total,
      page,
      limit,
    );

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: states,
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
        "Public states with conference count fetched successfully.",
      data: states,
      pagination,
    });
  },
);


// =====================================
// Get Public States With Exhibition Count
// =====================================
export const getPublicStatesWithExhibitionCount = asyncHandler(
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
      sortBy = "exhibitionCount",
      order = "desc",
    } = req.query;

    // =====================================
    // Validate Sort
    // =====================================

    const allowedSortFields = [
      "exhibitionCount",
      "state",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "exhibitionCount";

    const safeOrder = order === "asc" ? 1 : -1;

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey = `public-states-exhibition-count:${JSON.stringify({
      page,
      limit,
      search: search?.trim() || "",
      sortBy: safeSortBy,
      order: safeOrder,
    })}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public states with exhibition count fetched successfully (from cache).",
        data: cachedData.data,
        pagination: cachedData.pagination,
      });
    }

    // =====================================
    // Build State Match
    // =====================================

    const stateMatch = {};

    if (search?.trim()) {
      stateMatch.state = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // =====================================
    // Aggregation
    // =====================================

    const aggregation = [
      // -------------------------------------
      // Search State
      // -------------------------------------

      {
        $match: stateMatch,
      },

      // -------------------------------------
      // Lookup Approved Exhibitions
      // -------------------------------------

      {
        $lookup: {
          from: Exhibition.collection.name,

          let: {
            stateId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$stateId", "$$stateId"],
                    },
                    {
                      $eq: ["$status", "approved"],
                    },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],

          as: "exhibitionCountData",
        },
      },

      // -------------------------------------
      // Convert Count Array To Number
      // -------------------------------------

      {
        $addFields: {
          exhibitionCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$exhibitionCountData.count",
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // -------------------------------------
      // Only Required Response Fields
      // -------------------------------------

      {
        $project: {
          _id: 0,
          state: 1,
          exhibitionCount: 1,
        },
      },

      // -------------------------------------
      // Sorting
      // -------------------------------------

      {
        $sort:
          safeSortBy === "exhibitionCount"
            ? {
                exhibitionCount: safeOrder,
                state: 1,
              }
            : {
                state: safeOrder,
                exhibitionCount: -1,
              },
      },

      // -------------------------------------
      // Pagination
      // -------------------------------------

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },

            {
              $limit: limit,
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    // =====================================
    // Execute Aggregation
    // =====================================

    const [result] = await State.aggregate(aggregation);

    const states = result?.data || [];

    const total = result?.total?.[0]?.count || 0;

    // =====================================
    // Pagination Metadata
    // =====================================

    const pagination = buildPaginationMeta(
      total,
      page,
      limit,
    );

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: states,
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
        "Public states with exhibition count fetched successfully.",
      data: states,
      pagination,
    });
  },
);


// =====================================
// Clear Public State Cache
// =====================================
export const clearPublicStateCache = asyncHandler(
  async (req, res) => {
    await deleteCacheByPattern(
      "public-states-venue-count*",
    );

    await deleteCacheByPattern(
      "public-states-conference-count*",
    );

    await deleteCacheByPattern(
      "public-states-exhibition-count*",
    );

    return successResponse(res, {
      message: "Public state cache cleared successfully.",
    });
  },
);