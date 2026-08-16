import mongoose from "mongoose";

import Company from "../../models/Company.js";
import CompanyType from "../../models/CompanyType.js";
import State from "../../models/State.js";
import Exhibition from "../../models/Exhibition.js";
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
// Get All Public Companies By Company Type
// =====================================

export const getPublicCompaniesByCompanyType = asyncHandler(
  async (req, res) => {
    const { companyTypeId } = req.params;

    // =====================================
    // Validate Company Type ID
    // =====================================

    if (!mongoose.Types.ObjectId.isValid(companyTypeId)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid company type ID.",
      });
    }

    // =====================================
    // Check Company Type Exists
    // =====================================

    const companyType = await CompanyType.findById(companyTypeId)
      .select("_id companyTypeName")
      .lean();

    if (!companyType) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Company type not found.",
      });
    }

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
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // =====================================
    // Validate State ID
    // =====================================

    if (stateId && !mongoose.Types.ObjectId.isValid(stateId)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid state ID.",
      });
    }

    // =====================================
    // Search Regex
    // =====================================

    let searchRegex = null;

    if (search?.trim()) {
      searchRegex = new RegExp(search.trim(), "i");
    }

    // =====================================
    // Validate Featured
    // =====================================

    let featuredValue;

    if (featured !== undefined) {
      if (featured === "true") {
        featuredValue = true;
      } else if (featured === "false") {
        featuredValue = false;
      } else {
        return errorResponse(res, {
          statusCode: 400,
          message: "Featured must be true or false.",
        });
      }
    }

    // =====================================
    // Tomorrow
    // =====================================

    const tomorrow = new Date();

    tomorrow.setHours(0, 0, 0, 0);

    tomorrow.setDate(tomorrow.getDate() + 1);

    // =====================================
    // Base Company Match
    // =====================================

    const matchQuery = {
      companyTypeId: new mongoose.Types.ObjectId(companyTypeId),
      status: "approved",
    };

    // =====================================
    // State Filter
    // =====================================

    if (stateId) {
      matchQuery.stateId = new mongoose.Types.ObjectId(stateId);
    }

    // =====================================
    // City Filter
    // =====================================

    if (city?.trim()) {
      matchQuery.city = new RegExp(`^${city.trim()}$`, "i");
    }

    // =====================================
    // Featured Filter
    // =====================================

    if (featuredValue !== undefined) {
      matchQuery.featured = featuredValue;
    }

    // =====================================
    // Search
    // =====================================

    if (searchRegex) {
      matchQuery.$or = [
        {
          companyName: searchRegex,
        },
        {
          city: searchRegex,
        },
      ];
    }

    // =====================================
    // Allowed Sort Fields
    // =====================================

    const allowedSortFields = [
      "createdAt",
      "companyName",
      "city",
      "featured",
      "upcomingEvents",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeOrder = order === "asc" ? 1 : -1;

    // =====================================
    // Sort
    // =====================================

    let sort;

    if (safeSortBy === "featured") {
      // Featured companies first
      sort = {
        featured: -1,
        companyName: 1,
      };
    } else if (safeSortBy === "upcomingEvents") {
      // Upcoming event count sorting
      sort = {
        upcomingEvents: safeOrder,
        featured: -1,
        companyName: 1,
      };
    } else {
      // Featured always gets highest priority
      sort = {
        featured: -1,
        [safeSortBy]: safeOrder,
      };
    }

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey = `public-companies:company-type:${companyTypeId}:${JSON.stringify(
      {
        page,
        limit,
        search: search || "",
        city: city || "",
        stateId: stateId || "",
        featured:
          featured !== undefined ? featured : "",
        sort,
      },
    )}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public companies fetched successfully (from cache).",
        data: cachedData.data,
        pagination: cachedData.pagination,
      });
    }

    // =====================================
    // Aggregation Pipeline
    // =====================================

    const pipeline = [
      // =====================================
      // Match Approved Companies
      // =====================================

      {
        $match: matchQuery,
      },

      // =====================================
      // Lookup State
      // =====================================

      {
        $lookup: {
          from: "states",
          localField: "stateId",
          foreignField: "_id",
          as: "stateData",
        },
      },

      {
        $unwind: {
          path: "$stateData",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================
      // Lookup Company Type
      // =====================================

      {
        $lookup: {
          from: "companytypes",
          localField: "companyTypeId",
          foreignField: "_id",
          as: "companyTypeData",
        },
      },

      {
        $unwind: {
          path: "$companyTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================
      // Upcoming Exhibition Count
      // =====================================

      {
        $lookup: {
          from: "exhibitions",
          let: {
            companyId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$companyId",
                        "$$companyId",
                      ],
                    },
                    {
                      $eq: [
                        "$status",
                        "approved",
                      ],
                    },
                    {
                      $gte: [
                        "$startDate",
                        tomorrow,
                      ],
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "upcomingExhibitionData",
        },
      },

      // =====================================
      // Upcoming Conference Count
      // =====================================

      {
        $lookup: {
          from: "conferences",
          let: {
            companyId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$companyId",
                        "$$companyId",
                      ],
                    },
                    {
                      $eq: [
                        "$status",
                        "approved",
                      ],
                    },
                    {
                      $gte: [
                        "$startDate",
                        tomorrow,
                      ],
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "upcomingConferenceData",
        },
      },

      // =====================================
      // Add Counts
      // =====================================

      {
        $addFields: {
          upcomingExhibitionCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$upcomingExhibitionData.count",
                  0,
                ],
              },
              0,
            ],
          },

          upcomingConferenceCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$upcomingConferenceData.count",
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // =====================================
      // Total Upcoming Events
      // =====================================

      {
        $addFields: {
          upcomingEvents: {
            $add: [
              "$upcomingExhibitionCount",
              "$upcomingConferenceCount",
            ],
          },
        },
      },

      // =====================================
      // Sort BEFORE Pagination
      // =====================================

      {
        $sort: sort,
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
          ],

          totalCount: [
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

    const [result] = await Company.aggregate(pipeline);

    const companies = result?.data || [];

    const total =
      result?.totalCount?.[0]?.count || 0;

    // =====================================
    // Pagination
    // =====================================

    const pagination = buildPaginationMeta(
      total,
      page,
      limit,
    );

    // =====================================
    // Build Public Company Response
    // =====================================

    const publicCompanies = companies.map(
      (company) => ({
        _id: company._id,

        companyName: company.companyName,

        companyType: company.companyTypeData
          ? {
              _id: company.companyTypeData._id,
              companyTypeName:
                company.companyTypeData
                  .companyTypeName,
            }
          : null,

        state: company.stateData
          ? {
              _id: company.stateData._id,
              state: company.stateData.state,
            }
          : null,

        city: company.city,

        address: company.address,

        website: company.website,

        featured: company.featured,

        uploadLogo: company.uploadLogo,

        upcomingEvents:
          company.upcomingEvents || 0,
      }),
    );

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: publicCompanies,
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
        "Public companies fetched successfully.",
      data: publicCompanies,
      pagination,
    });
  },
);


// =====================================
// Clear Public Company Cache
// =====================================

export const clearPublicCompanyCache = asyncHandler(
  async (req, res) => {
    await deleteCacheByPattern(
      "public-companies*",
    );

    return successResponse(res, {
      message:
        "Public company cache cleared successfully.",
    });
  },
);

// =====================================
// Get All Public Companies
// Excluding Exhibition Organizer & Conference Organizer (PCO)
// =====================================

export const getPublicCompanies = asyncHandler(
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
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // =====================================
    // Validate State ID
    // =====================================

    if (stateId && !mongoose.Types.ObjectId.isValid(stateId)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid state ID.",
      });
    }

    // =====================================
    // Search Regex
    // =====================================

    let searchRegex = null;

    if (search?.trim()) {
      searchRegex = new RegExp(search.trim(), "i");
    }

    // =====================================
    // Validate Featured
    // =====================================

    let featuredValue;

    if (featured !== undefined) {
      if (featured === "true") {
        featuredValue = true;
      } else if (featured === "false") {
        featuredValue = false;
      } else {
        return errorResponse(res, {
          statusCode: 400,
          message: "Featured must be true or false.",
        });
      }
    }

    // =====================================
    // Upcoming Date
    // =====================================

    const tomorrow = new Date();

    tomorrow.setHours(0, 0, 0, 0);

    tomorrow.setDate(tomorrow.getDate() + 1);

    // =====================================
    // Base Company Match
    // =====================================

    const matchQuery = {
      status: "approved",
    };

    // =====================================
    // State Filter
    // =====================================

    if (stateId) {
      matchQuery.stateId =
        new mongoose.Types.ObjectId(stateId);
    }

    // =====================================
    // City Filter
    // =====================================

    if (city?.trim()) {
      matchQuery.city = new RegExp(
        `^${city.trim()}$`,
        "i",
      );
    }

    // =====================================
    // Featured Filter
    // =====================================

    if (featuredValue !== undefined) {
      matchQuery.featured = featuredValue;
    }

    // =====================================
    // Allowed Sort Fields
    // =====================================

    const allowedSortFields = [
      "createdAt",
      "companyName",
      "city",
      "featured",
      "upcomingEvents",
    ];

    const safeSortBy = allowedSortFields.includes(
      sortBy,
    )
      ? sortBy
      : "createdAt";

    const safeOrder = order === "asc" ? 1 : -1;

    // =====================================
    // Sorting
    // =====================================

    let sort;

    if (safeSortBy === "featured") {
      // Featured companies first
      sort = {
        featured: -1,
        companyName: 1,
      };
    } else if (safeSortBy === "upcomingEvents") {
      // Upcoming events first.
      // Featured is secondary priority.
      sort = {
        upcomingEvents: safeOrder,
        featured: -1,
        companyName: 1,
      };
    } else {
      // Featured companies always first.
      // Requested field is secondary sorting.
      sort = {
        featured: -1,
        [safeSortBy]: safeOrder,
      };
    }

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey =
      `public-companies:all-except-organizers:${JSON.stringify(
        {
          page,
          limit,
          search: search || "",
          city: city || "",
          stateId: stateId || "",
          featured:
            featured !== undefined
              ? featured
              : "",
          sort,
        },
      )}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public companies fetched successfully (from cache).",

        data: cachedData.data,

        pagination: cachedData.pagination,
      });
    }

    // =====================================
    // Aggregation Pipeline
    // =====================================

    const pipeline = [
      // =====================================
      // Match Approved Companies
      // =====================================

      {
        $match: matchQuery,
      },

      // =====================================
      // Populate Company Type
      // =====================================

      {
        $lookup: {
          from: "companytypes",

          localField: "companyTypeId",

          foreignField: "_id",

          as: "companyTypeData",
        },
      },

      {
        $unwind: {
          path: "$companyTypeData",

          preserveNullAndEmptyArrays: false,
        },
      },

      // =====================================
      // EXCLUDE:
      //
      // Exhibition Organizer
      // Professional Conference Organiser (PCO)
      // =====================================

      {
        $match: {
          "companyTypeData.companyTypeName": {
            $nin: [
              "Exhibition Organizer",
              "Professional Conference Organiser (PCO)",
            ],
          },
        },
      },

      // =====================================
      // Search
      // =====================================

      ...(searchRegex
        ? [
            {
              $match: {
                $or: [
                  {
                    companyName: searchRegex,
                  },
                  {
                    city: searchRegex,
                  },
                  {
                    "companyTypeData.companyTypeName":
                      searchRegex,
                  },
                ],
              },
            },
          ]
        : []),

      // =====================================
      // Populate State
      // =====================================

      {
        $lookup: {
          from: "states",

          localField: "stateId",

          foreignField: "_id",

          as: "stateData",
        },
      },

      {
        $unwind: {
          path: "$stateData",

          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================
      // Upcoming Exhibition Count
      // =====================================

      {
        $lookup: {
          from: "exhibitions",

          let: {
            companyId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$companyId",
                        "$$companyId",
                      ],
                    },

                    {
                      $eq: [
                        "$status",
                        "approved",
                      ],
                    },

                    {
                      $gte: [
                        "$startDate",
                        tomorrow,
                      ],
                    },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],

          as: "upcomingExhibitionData",
        },
      },

      // =====================================
      // Upcoming Conference Count
      // =====================================

      {
        $lookup: {
          from: "conferences",

          let: {
            companyId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$companyId",
                        "$$companyId",
                      ],
                    },

                    {
                      $eq: [
                        "$status",
                        "approved",
                      ],
                    },

                    {
                      $gte: [
                        "$startDate",
                        tomorrow,
                      ],
                    },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],

          as: "upcomingConferenceData",
        },
      },

      // =====================================
      // Calculate Counts
      // =====================================

      {
        $addFields: {
          upcomingExhibitionCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$upcomingExhibitionData.count",
                  0,
                ],
              },

              0,
            ],
          },

          upcomingConferenceCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$upcomingConferenceData.count",
                  0,
                ],
              },

              0,
            ],
          },
        },
      },

      // =====================================
      // Total Upcoming Events
      // =====================================

      {
        $addFields: {
          upcomingEvents: {
            $add: [
              "$upcomingExhibitionCount",
              "$upcomingConferenceCount",
            ],
          },
        },
      },

      // =====================================
      // Sort BEFORE Pagination
      // =====================================

      {
        $sort: sort,
      },

      // =====================================
      // Pagination
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
          ],

          totalCount: [
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

    const [result] =
      await Company.aggregate(pipeline);

    const companies = result?.data || [];

    const total =
      result?.totalCount?.[0]?.count || 0;

    // =====================================
    // Pagination Metadata
    // =====================================

    const pagination = buildPaginationMeta(
      total,
      page,
      limit,
    );

    // =====================================
    // Build Public Company Response
    // =====================================

    const publicCompanies = companies.map(
      (company) => ({
        _id: company._id,

        companyName: company.companyName,

        companyType: company.companyTypeData
          ? {
              _id:
                company.companyTypeData._id,

              companyTypeName:
                company.companyTypeData
                  .companyTypeName,
            }
          : null,

        state: company.stateData
          ? {
              _id: company.stateData._id,

              state:
                company.stateData.state,
            }
          : null,

        city: company.city,

        address: company.address,

        website: company.website,

        featured: company.featured,

        uploadLogo: company.uploadLogo,

        upcomingEvents:
          company.upcomingEvents || 0,
      }),
    );

    // =====================================
    // Response Data
    // =====================================

    const responseData = {
      data: publicCompanies,

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
        "Public companies fetched successfully.",

      data: publicCompanies,

      pagination,
    });
  },
);