import mongoose from "mongoose";

import Venue from "../../models/Venue.js";
import Exhibition from "../../models/Exhibition.js";
import Conference from "../../models/Conference.js";
import Contact from "../../models/Contact.js";
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
// Get All Public Venues
// =====================================
export const getPublicVenues = asyncHandler(async (req, res) => {
  // =====================================
  // Pagination
  // =====================================

  const { page, limit, skip } =
    getPagination(req);

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
  // Build Venue Query
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
        venueName: searchRegex,
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
  // Sorting
  // =====================================

  const allowedSortFields = [
    "createdAt",
    "venueName",
    "city",
    "featured",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

  const safeOrder =
    order === "asc" ? 1 : -1;

  const sort = {
    [safeSortBy]: safeOrder,
  };

  // =====================================
  // Cache Key
  // =====================================

  const cacheKey = `public-venues:${JSON.stringify({
    page,
    limit,
    query,
    sort,
  })}`;

  // =====================================
  // Check Redis
  // =====================================

  const cachedData =
    await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message:
        "Public venues fetched successfully (from cache).",

      data: cachedData.data,

      pagination:
        cachedData.pagination,
    });
  }

  // =====================================
  // Get Venues + Total
  // =====================================

  const [venues, total] =
    await Promise.all([
      Venue.find(query)
        .select(
          "_id venueName stateId city uploadVenuePhoto featured",
        )

        // FIXED: State model field is "state"
        .populate({
          path: "stateId",
          select: "_id state",
        })

        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Venue.countDocuments(query),
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
  // No Venues
  // =====================================

  if (!venues.length) {
    const responseData = {
      data: [],
      pagination,
    };

    await setCache(
      cacheKey,
      responseData,
      3600,
    );

    return successResponse(res, {
      message:
        "Public venues fetched successfully.",

      data: [],

      pagination,
    });
  }

  // =====================================
  // Current Page Venue IDs
  // =====================================

  const venueIds = venues.map(
    (venue) => venue._id,
  );

  // =====================================
  // Upcoming Date
  // =====================================

  const tomorrow = new Date();

  tomorrow.setHours(
    0,
    0,
    0,
    0,
  );

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  // =====================================
  // Upcoming Exhibition Counts
  // =====================================

  const exhibitionCounts =
    await Exhibition.aggregate([
      {
        $match: {
          venueId: {
            $in: venueIds,
          },

          status: "approved",

          startDate: {
            $gte: tomorrow,
          },
        },
      },

      {
        $group: {
          _id: "$venueId",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

  // =====================================
  // Upcoming Conference Counts
  // =====================================

  const conferenceCounts =
    await Conference.aggregate([
      {
        $match: {
          venueId: {
            $in: venueIds,
          },

          status: "approved",

          startDate: {
            $gte: tomorrow,
          },
        },
      },

      {
        $group: {
          _id: "$venueId",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

  // =====================================
  // Create Count Maps
  // =====================================

  const exhibitionCountMap =
    new Map();

  for (const item of exhibitionCounts) {
    exhibitionCountMap.set(
      item._id.toString(),
      item.count,
    );
  }

  const conferenceCountMap =
    new Map();

  for (const item of conferenceCounts) {
    conferenceCountMap.set(
      item._id.toString(),
      item.count,
    );
  }

  // =====================================
  // Build Public Venue Response
  // =====================================

  const publicVenues =
    venues.map((venue) => {
      const venueId =
        venue._id.toString();

      const exhibitionCount =
        exhibitionCountMap.get(
          venueId,
        ) || 0;

      const conferenceCount =
        conferenceCountMap.get(
          venueId,
        ) || 0;

      return {
        _id: venue._id,

        venueName:
          venue.venueName,

        city:
          venue.city,

        // FIXED: Return actual State field
        state: venue.stateId
          ? {
              _id:
                venue.stateId._id,

              state:
                venue.stateId.state,
            }
          : null,

        uploadVenuePhoto:
          venue.uploadVenuePhoto,

        featured:
          venue.featured,

        upcomingEvents:
          exhibitionCount +
          conferenceCount,
      };
    });

  // =====================================
  // Save Cache
  // =====================================

  const responseData = {
    data: publicVenues,
    pagination,
  };

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
      "Public venues fetched successfully.",

    data: publicVenues,

    pagination,
  });
});


// =====================================
// Get Public Venue By ID
// =====================================
export const getPublicVenueById = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    // =====================================
    // Validate ObjectId
    // =====================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid venue ID.",
      });
    }

    // =====================================
    // Cache Key
    // =====================================

    const cacheKey = `public-venue:${id}`;

    // =====================================
    // Check Redis Cache
    // =====================================

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return successResponse(res, {
        message:
          "Public venue fetched successfully (from cache).",

        data: cachedData,
      });
    }

    // =====================================
    // Find Approved Venue
    // =====================================

    const venue = await Venue.findOne({
      _id: id,
      status: "approved",
    })
      .select(
        "_id venueName stateId city address website mapLink uploadVenuePhoto featured phone uploadVenueLayout status createdAt updatedAt __v",
      )
      .populate({
        path: "stateId",
        select: "_id state",
      })
      .lean();

    // =====================================
    // Venue Not Found
    // =====================================

    if (!venue) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Public venue not found.",
      });
    }

    // =====================================
    // Upcoming Date
    // =====================================

    const tomorrow = new Date();

    tomorrow.setHours(
      0,
      0,
      0,
      0,
    );

    tomorrow.setDate(
      tomorrow.getDate() + 1,
    );

    // =====================================
    // Upcoming Exhibition Count
    // =====================================

    const upcomingExhibitionCount =
      await Exhibition.countDocuments({
        venueId: venue._id,

        status: "approved",

        startDate: {
          $gte: tomorrow,
        },
      });

    // =====================================
    // Upcoming Conference Count
    // =====================================

    const upcomingConferenceCount =
      await Conference.countDocuments({
        venueId: venue._id,

        status: "approved",

        startDate: {
          $gte: tomorrow,
        },
      });

    // =====================================
    // Total Upcoming Events
    // =====================================

    const upcomingEvents =
      upcomingExhibitionCount +
      upcomingConferenceCount;

    // =====================================
    // Get Venue Key Contacts
    // =====================================

    const keyContacts =
      await Contact.find({
        venueId: venue._id,
        status: "approved",
      })
        .select(
          "_id fullName email mobile stateId companyId venueId associationId status",
        )
        .lean();

    // =====================================
    // Build Public Venue Response
    // =====================================

    const publicVenue = {
      _id: venue._id,

      venueName:
        venue.venueName,

      stateId: venue.stateId
        ? {
            _id:
              venue.stateId._id,

            state:
              venue.stateId.state,
          }
        : null,

      city:
        venue.city,

      address:
        venue.address,

      website:
        venue.website,

      mapLink:
        venue.mapLink,

      uploadVenuePhoto:
        venue.uploadVenuePhoto,

      featured:
        venue.featured,

      phone:
        venue.phone,

      uploadVenueLayout:
        venue.uploadVenueLayout,

      status:
        venue.status,

      createdAt:
        venue.createdAt,

      updatedAt:
        venue.updatedAt,

      __v:
        venue.__v,

      upcomingEvents,

      keyContacts,
    };

    // =====================================
    // Save Redis Cache
    // =====================================

    await setCache(
      cacheKey,
      publicVenue,
      3600,
    );

    // =====================================
    // Response
    // =====================================

    return successResponse(res, {
      message:
        "Public venue fetched successfully.",

      data: publicVenue,
    });
  },
);


// =====================================
// Clear Public Venue Cache
// =====================================
export const clearPublicVenueCache = asyncHandler(
  async (req, res) => {
    await deleteCacheByPattern(
      "public-venues*",
    );

    await deleteCacheByPattern(
      "public-venue*",
    );

    return successResponse(res, {
      message:
        "Public venue cache cleared successfully.",
    });
  },
);