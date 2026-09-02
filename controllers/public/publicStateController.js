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
// Get Public States With Upcoming Conference Count
// =====================================
export const getPublicStatesWithConferenceCount =
  asyncHandler(async (req, res) => {
    // =====================================
    // Pagination
    // =====================================

    const { page, limit, skip } = getPagination(req);

    // =====================================
    // Current Date
    // =====================================

    const now = new Date();

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey =
      `public-state-conference-count:${JSON.stringify({
        page,
        limit,
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
    // Aggregate Upcoming Conferences
    // =====================================

    const result = await Conference.aggregate([
      // =====================================
      // Only Approved Upcoming Conferences
      // =====================================

      {
        $match: {
          status: "approved",

          startDate: {
            $gte: now,
          },

          stateId: {
            $ne: null,
          },
        },
      },

      // =====================================
      // Group By State
      // =====================================

      {
        $group: {
          _id: "$stateId",

          upcomingConferenceCount: {
            $sum: 1,
          },
        },
      },

      // =====================================
      // Populate State
      // =====================================

      {
        $lookup: {
          from: "states",

          localField: "_id",

          foreignField: "_id",

          as: "state",
        },
      },

      // =====================================
      // Convert State Array To Object
      // =====================================

      {
        $unwind: "$state",
      },

      // =====================================
      // Sort
      // =====================================
      //
      // States having more upcoming conferences
      // appear first.
      //
      // If counts are equal, state name is
      // sorted alphabetically.
      // =====================================

      {
        $sort: {
          upcomingConferenceCount: -1,

          "state.state": 1,
        },
      },

      // =====================================
      // Pagination + Total Count
      // =====================================

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },

            {
              $limit: limit,
            },

            {
              $project: {
                _id: 0,

                state: "$state.state",

                upcomingConferenceCount: 1,
              },
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    // =====================================
    // Extract Data
    // =====================================

    const data = result[0]?.data || [];

    const total =
      result[0]?.total?.[0]?.count || 0;

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
    // Response Data
    // =====================================

    const responseData = {
      data,

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

      data,

      pagination,
    });
  });


// =====================================
// Get Public States With Upcoming Exhibition Count
// =====================================
export const getPublicStatesWithExhibitionCount =
  asyncHandler(async (req, res) => {
    // =====================================
    // Pagination
    // =====================================

    const { page, limit, skip } = getPagination(req);

    // =====================================
    // Current Date
    // =====================================

    const now = new Date();

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey =
      `public-state-exhibition-count:${JSON.stringify({
        page,
        limit,
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
    // Aggregate Upcoming Exhibitions
    // =====================================

    const result = await Exhibition.aggregate([
      // =====================================
      // Only Approved Upcoming Exhibitions
      // =====================================

      {
        $match: {
          status: "approved",

          startDate: {
            $gte: now,
          },

          stateId: {
            $ne: null,
          },
        },
      },

      // =====================================
      // Group By State
      // =====================================

      {
        $group: {
          _id: "$stateId",

          upcomingExhibitionCount: {
            $sum: 1,
          },
        },
      },

      // =====================================
      // Populate State
      // =====================================

      {
        $lookup: {
          from: "states",

          localField: "_id",

          foreignField: "_id",

          as: "state",
        },
      },

      // =====================================
      // Convert State Array To Object
      // =====================================

      {
        $unwind: "$state",
      },

      // =====================================
      // Sort
      // =====================================

      {
        $sort: {
          upcomingExhibitionCount: -1,

          "state.state": 1,
        },
      },

      // =====================================
      // Pagination + Total Count
      // =====================================

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },

            {
              $limit: limit,
            },

            {
              $project: {
                _id: 0,

                state: "$state.state",

                upcomingExhibitionCount: 1,
              },
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    // =====================================
    // Extract Data
    // =====================================

    const data = result[0]?.data || [];

    const total =
      result[0]?.total?.[0]?.count || 0;

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
    // Response Data
    // =====================================

    const responseData = {
      data,

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

      data,

      pagination,
    });
  });


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