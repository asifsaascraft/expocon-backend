import mongoose from "mongoose";

import Venue from "../models/Venue.js";
import State from "../models/State.js";

import asyncHandler from "../utils/asyncHandler.js";

import { successResponse, errorResponse } from "../utils/response.js";

import {
  deleteCacheByPattern,
  getCache,
  setCache,
} from "../utils/redisCache.js";

import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";

import deleteS3Object from "../utils/deleteS3Object.js";

//==============================
// Venue Populate
//==============================
const populateVenue = (query) =>
  query
    .populate("stateId", "state")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");

//==============================
// Create Venue
//==============================
export const createVenue = asyncHandler(async (req, res) => {
  const {
    venueName,
    stateId,
    city,
    address,
    website,
    featured,
    mapLink,
    phone,
  } = req.body;

  // Validate Required Fields

  if (
    !venueName?.trim() ||
    !stateId ||
    !city?.trim() ||
    !address?.trim() ||
    !website?.trim() ||
    !mapLink?.trim()
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  // Venue Photo Required

  const venuePhoto = req.files?.uploadVenuePhoto?.[0]?.location || null;

  if (!venuePhoto) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Venue photo is required.",
    });
  }

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(stateId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Check State

  const state = await State.findById(stateId);

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  // Duplicate Venue Name

  const escapedVenueName = venueName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingVenue = await Venue.findOne({
    venueName: {
      $regex: `^${escapedVenueName}$`,
      $options: "i",
    },
  });

  if (existingVenue) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Venue name already exists.",
    });
  }
  // Prepare Data

  const venueData = {
    venueName: venueName.trim(),
    stateId,
    city: city.trim(),
    address: address.trim(),
    website: website.trim(),
    featured: featured !== undefined ? featured === "true" : true,
    mapLink: mapLink.trim(),
    phone: phone?.trim() || null,

    uploadVenuePhoto: venuePhoto,

    uploadVenueLayout: req.files?.uploadVenueLayout?.[0]?.location || null,

    createdBy: req.user._id,
  };

  // Admin -> Auto Approve

  if (req.user.role === "admin") {
    venueData.status = "approved";
    venueData.approvedBy = req.user._id;
    venueData.approvedAt = new Date();
  } else {
    venueData.status = "pending";
  }

  // Create Venue

  const venue = await Venue.create(venueData);

  // Populate Venue

  const populatedVenue = await populateVenue(Venue.findById(venue._id));

  // Clear Cache

  await deleteCacheByPattern("venues*");
  await deleteCacheByPattern("venue*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Venue created successfully."
        : "Venue submitted successfully and is awaiting admin approval.",
    data: populatedVenue,
  });
});

//==============================
// Get Venues
//==============================
export const getVenues = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "venueName",
    "city",
    "website",
    "phone",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "featured",
    "stateId",
  ]);

  // Role Based Query

  let roleQuery = {};

  if (req.user.role === "staff") {
    roleQuery = {
      $or: [
        {
          status: "approved",
        },
        {
          createdBy: req.user._id,
          status: {
            $in: ["pending", "rejected"],
          },
        },
      ],
    };

    // Staff cannot filter status manually

    delete filtersQuery.status;
  }

  // Final Query

  const query = {
    ...roleQuery,
    ...searchQuery,
    ...filtersQuery,
  };

  // Sorting

  const sort = buildSortQuery(req);

  // Cache Key

  const cacheKey = `venues:${JSON.stringify({
    role: req.user.role,
    userId: req.user._id,
    page,
    limit,
    query,
    sort,
  })}`;

  // Check Cache

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Venues fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [venues, total] = await Promise.all([
    populateVenue(Venue.find(query)).sort(sort).skip(skip).limit(limit),

    Venue.countDocuments(query),
  ]);

  // Pagination

  const pagination = buildPaginationMeta(total, page, limit);

  // Save Cache

  await setCache(
    cacheKey,
    {
      data: venues,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Venues fetched successfully.",
    data: venues,
    pagination,
  });
});

//==============================
// Get Venue By ID
//==============================
export const getVenueById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid venue ID.",
    });
  }

  // Cache Key

  const cacheKey = `venue:${id}:${req.user.role}:${req.user._id}`;

  // Check Cache

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Venue fetched successfully (from cache).",
      data: cachedData,
    });
  }

  // Find Venue

  const venue = await populateVenue(Venue.findById(id));

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    const isOwner =
      venue.createdBy &&
      venue.createdBy._id.toString() === req.user._id.toString();

    const isApproved = venue.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to view this venue.",
      });
    }
  }

  // Save Cache

  await setCache(cacheKey, venue, 3600);

  return successResponse(res, {
    message: "Venue fetched successfully.",
    data: venue,
  });
});

//==============================
// Update Venue
//==============================
export const updateVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    venueName,
    stateId,
    city,
    address,
    website,
    featured,
    mapLink,
    phone,
  } = req.body;

  // Validate Venue ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid venue ID.",
    });
  }

  // Find Venue

  const venue = await Venue.findById(id);

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (venue.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this venue.",
      });
    }

    if (venue.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending venue.",
      });
    }
  }

  // Validate Required Fields

  if (
    !venueName?.trim() ||
    !stateId ||
    !city?.trim() ||
    !address?.trim() ||
    !website?.trim() ||
    !mapLink?.trim()
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  // Validate State ID

  if (!mongoose.Types.ObjectId.isValid(stateId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Validate State

  const state = await State.findById(stateId);

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  // Duplicate Venue Name

  const escapedVenueName = venueName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingVenue = await Venue.findOne({
    venueName: {
      $regex: `^${escapedVenueName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingVenue) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Venue name already exists.",
    });
  }
  // Update Venue

  venue.venueName = venueName.trim();
  venue.stateId = stateId;
  venue.city = city.trim();
  venue.address = address.trim();
  venue.website = website.trim();

  venue.featured =
    featured !== undefined ? featured === "true" : venue.featured;

  venue.mapLink = mapLink.trim();
  venue.phone = phone?.trim() || null;

  // Replace Venue Photo

  const newVenuePhoto = req.files?.uploadVenuePhoto?.[0]?.location;

  if (newVenuePhoto) {
    // Delete old photo from S3

    if (venue.uploadVenuePhoto) {
      await deleteS3Object(venue.uploadVenuePhoto);
    }

    // Save new photo

    venue.uploadVenuePhoto = newVenuePhoto;
  }

  // Replace Venue Layout

  const newVenueLayout = req.files?.uploadVenueLayout?.[0]?.location;

  if (newVenueLayout) {
    // Delete old layout from S3

    if (venue.uploadVenueLayout) {
      await deleteS3Object(venue.uploadVenueLayout);
    }

    // Save new layout

    venue.uploadVenueLayout = newVenueLayout;
  }

  // Audit

  venue.updatedBy = req.user._id;

  // Save

  await venue.save();

  // Populate

  const populatedVenue = await populateVenue(Venue.findById(venue._id));

  // Clear Cache

  await deleteCacheByPattern("venues*");
  await deleteCacheByPattern("venue*");

  return successResponse(res, {
    message: "Venue updated successfully.",
    data: populatedVenue,
  });
});

//==============================
// Delete Venue
//==============================
export const deleteVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid venue ID.",
    });
  }

  // Find Venue

  const venue = await Venue.findById(id);

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (venue.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this venue.",
      });
    }

    if (venue.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending venue.",
      });
    }
  }

  // Delete Venue Photo

  if (venue.uploadVenuePhoto) {
    await deleteS3Object(venue.uploadVenuePhoto);
  }

  // Delete Venue Layout

  if (venue.uploadVenueLayout) {
    await deleteS3Object(venue.uploadVenueLayout);
  }

  // Delete Venue

  await venue.deleteOne();

  // Clear Cache

  await deleteCacheByPattern("venues*");
  await deleteCacheByPattern("venue*");

  return successResponse(res, {
    message: "Venue deleted successfully.",
  });
});

//==============================
// Approve Venue
//==============================
export const approveVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Venue ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid venue ID.",
    });
  }

  // Find Venue

  const venue = await Venue.findById(id);

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  // Check Status

  if (venue.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Venue is already approved.",
    });
  }

  if (venue.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected venue cannot be approved.",
    });
  }

  // Approve Venue

  venue.status = "approved";
  venue.approvedBy = req.user._id;
  venue.approvedAt = new Date();

  // Clear Rejection Info

  venue.rejectedBy = null;
  venue.rejectedAt = null;

  // Track Update

  venue.updatedBy = req.user._id;

  await venue.save();

  // Populate

  const populatedVenue = await populateVenue(Venue.findById(venue._id));

  // Clear Cache

  await deleteCacheByPattern("venues*");
  await deleteCacheByPattern("venue*");

  return successResponse(res, {
    message: "Venue approved successfully.",
    data: populatedVenue,
  });
});

//==============================
// Reject Venue
//==============================
export const rejectVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Venue ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid venue ID.",
    });
  }

  // Find Venue

  const venue = await Venue.findById(id);

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  // Check Status

  if (venue.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Venue is already rejected.",
    });
  }

  if (venue.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved venue cannot be rejected.",
    });
  }

  // Reject Venue

  venue.status = "rejected";
  venue.rejectedBy = req.user._id;
  venue.rejectedAt = new Date();

  // Clear Approval Info

  venue.approvedBy = null;
  venue.approvedAt = null;

  // Track Update

  venue.updatedBy = req.user._id;

  await venue.save();

  // Populate

  const populatedVenue = await populateVenue(Venue.findById(venue._id));

  // Clear Cache

  await deleteCacheByPattern("venues*");
  await deleteCacheByPattern("venue*");

  return successResponse(res, {
    message: "Venue rejected successfully.",
    data: populatedVenue,
  });
});
