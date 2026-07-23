import mongoose from "mongoose";

import Exhibition from "../models/Exhibition.js";
import EventType from "../models/EventType.js";
import EntryType from "../models/EntryType.js";
import State from "../models/State.js";
import Venue from "../models/Venue.js";
import Company from "../models/Company.js";
import ExhibitionType from "../models/ExhibitionType.js";

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
// Exhibition Populate
//==============================
const populateExhibition = (query) =>
  query
    .populate("eventTypeId", "eventTypeName")
    .populate("entryTypeId", "entryTypeName")
    .populate("stateId", "state")
    .populate("venueId", "venueName")
    .populate("companyId", "companyName")
    .populate("exhibitionTypeId", "exhibitionTypeName")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");

//==============================
// Create Exhibition
//==============================
export const createExhibition = asyncHandler(async (req, res) => {
  const {
    eventTypeId,
    eventName,
    eventShortName,
    startDate,
    endDate,
    month,
    year,
    entryTypeId,
    city,
    stateId,
    venueId,
    website,
    companyId,
    exhibitionTypeId,
    frequency,
    aboutExhibition,
    exhibitorProfile,
    speciality,
    visitorProfile,
  } = req.body;

  //==============================
  // Validate Required Fields
  //==============================

  if (
    !eventTypeId ||
    !eventName?.trim() ||
    !eventShortName?.trim() ||
    !startDate ||
    !endDate ||
    !month?.trim() ||
    !year?.trim() ||
    !entryTypeId ||
    !city?.trim() ||
    !stateId ||
    !venueId ||
    !website?.trim()
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  //==============================
  // Validate ObjectIds
  //==============================

  const ids = [
    {
      value: eventTypeId,
      message: "Invalid event type ID.",
    },
    {
      value: entryTypeId,
      message: "Invalid entry type ID.",
    },
    {
      value: stateId,
      message: "Invalid state ID.",
    },
    {
      value: venueId,
      message: "Invalid venue ID.",
    },
  ];

  for (const item of ids) {
    if (!mongoose.Types.ObjectId.isValid(item.value)) {
      return errorResponse(res, {
        statusCode: 400,
        message: item.message,
      });
    }
  }

  if (companyId && !mongoose.Types.ObjectId.isValid(companyId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  if (exhibitionTypeId && !mongoose.Types.ObjectId.isValid(exhibitionTypeId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition type ID.",
    });
  }

  //==============================
  // Validate Master Data
  //==============================

  const [eventType, entryType, state, venue, company, exhibitionType] =
    await Promise.all([
      EventType.findById(eventTypeId),
      EntryType.findById(entryTypeId),
      State.findById(stateId),
      Venue.findById(venueId),
      companyId ? Company.findById(companyId) : null,
      exhibitionTypeId ? ExhibitionType.findById(exhibitionTypeId) : null,
    ]);

  if (!eventType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Event type not found.",
    });
  }

  if (!entryType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Entry type not found.",
    });
  }

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  if (companyId && !company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  if (exhibitionTypeId && !exhibitionType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition type not found.",
    });
  }

  //==============================
  // Duplicate Event Name
  //==============================

  const escapedEventName = eventName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingEventName = await Exhibition.findOne({
    eventName: {
      $regex: `^${escapedEventName}$`,
      $options: "i",
    },
  });

  if (existingEventName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Event name already exists.",
    });
  }

  //==============================
  // Duplicate Short Name
  //==============================

  const escapedShortName = eventShortName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingShortName = await Exhibition.findOne({
    eventShortName: {
      $regex: `^${escapedShortName}$`,
      $options: "i",
    },
  });

  if (existingShortName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Event short name already exists.",
    });
  }

  //==============================
  // Prepare Data
  //==============================

  const exhibitionData = {
    eventTypeId,
    eventName: eventName.trim(),
    eventShortName: eventShortName.trim(),
    startDate,
    endDate,
    month: month.trim(),
    year: year.trim(),
    entryTypeId,
    city: city.trim(),
    stateId,
    venueId,
    website: website.trim(),
    companyId: companyId?.trim() || null,
    exhibitionTypeId: exhibitionTypeId?.trim() || null,
    uploadEventLogo: req.file ? req.file.location : null,
    frequency: frequency?.trim() || null,
    aboutExhibition: aboutExhibition?.trim() || null,
    exhibitorProfile: exhibitorProfile?.trim() || null,
    speciality: speciality?.trim() || null,
    visitorProfile: visitorProfile?.trim() || null,
    createdBy: req.user._id,
  };

  //==============================
  // Admin Auto Approval
  //==============================

  if (req.user.role === "admin") {
    exhibitionData.status = "approved";
    exhibitionData.approvedBy = req.user._id;
    exhibitionData.approvedAt = new Date();
  } else {
    exhibitionData.status = "pending";
  }

  //==============================
  // Create Exhibition
  //==============================

  const exhibition = await Exhibition.create(exhibitionData);

  const populatedExhibition = await populateExhibition(
    Exhibition.findById(exhibition._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("exhibitions*");
  await deleteCacheByPattern("exhibition*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Exhibition created successfully."
        : "Exhibition submitted successfully and is awaiting admin approval.",
    data: populatedExhibition,
  });
});

//==============================
// Get Exhibitions
//==============================
export const getExhibitions = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "eventName",
    "eventShortName",
    "city",
    "website",
    "month",
    "year",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "eventTypeId",
    "stateId",
    "venueId",
    "companyId",
    "exhibitionTypeId",
    "entryTypeId",
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

    // Staff cannot filter status

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

  const cacheKey = `exhibitions:${JSON.stringify({
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
      message: "Exhibitions fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [exhibitions, total] = await Promise.all([
    populateExhibition(Exhibition.find(query))
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Exhibition.countDocuments(query),
  ]);

  // Pagination

  const pagination = buildPaginationMeta(total, page, limit);

  // Save Cache

  await setCache(
    cacheKey,
    {
      data: exhibitions,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Exhibitions fetched successfully.",
    data: exhibitions,
    pagination,
  });
});

//==============================
// Get Exhibition By ID
//==============================
export const getExhibitionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition ID.",
    });
  }

  // Cache Key

  const cacheKey = `exhibition:${id}:${req.user.role}:${req.user._id}`;

  // Check Cache

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Exhibition fetched successfully (from cache).",
      data: cachedData,
    });
  }

  // Find Exhibition

  const exhibition = await populateExhibition(Exhibition.findById(id));

  if (!exhibition) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    const isOwner =
      exhibition.createdBy &&
      exhibition.createdBy._id.toString() === req.user._id.toString();

    const isApproved = exhibition.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to view this exhibition.",
      });
    }
  }

  // Save Cache

  await setCache(cacheKey, exhibition, 3600);

  return successResponse(res, {
    message: "Exhibition fetched successfully.",
    data: exhibition,
  });
});

//==============================
// Update Exhibition
//==============================
export const updateExhibition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    eventTypeId,
    eventName,
    eventShortName,
    startDate,
    endDate,
    month,
    year,
    entryTypeId,
    city,
    stateId,
    venueId,
    website,
    companyId,
    exhibitionTypeId,
    frequency,
    aboutExhibition,
    exhibitorProfile,
    speciality,
    visitorProfile,
  } = req.body;

  //==============================
  // Validate Exhibition ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition ID.",
    });
  }

  //==============================
  // Find Exhibition
  //==============================

  const exhibition = await Exhibition.findById(id);

  if (!exhibition) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    if (exhibition.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this exhibition.",
      });
    }

    if (exhibition.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending exhibition.",
      });
    }
  }

  //==============================
  // Validate Required Fields
  //==============================

  if (
    !eventTypeId ||
    !eventName?.trim() ||
    !eventShortName?.trim() ||
    !startDate ||
    !endDate ||
    !month?.trim() ||
    !year?.trim() ||
    !entryTypeId ||
    !city?.trim() ||
    !stateId ||
    !venueId ||
    !website?.trim()
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  //==============================
  // Validate ObjectIds
  //==============================

  const ids = [
    {
      value: eventTypeId,
      message: "Invalid event type ID.",
    },
    {
      value: entryTypeId,
      message: "Invalid entry type ID.",
    },
    {
      value: stateId,
      message: "Invalid state ID.",
    },
    {
      value: venueId,
      message: "Invalid venue ID.",
    },
  ];

  for (const item of ids) {
    if (!mongoose.Types.ObjectId.isValid(item.value)) {
      return errorResponse(res, {
        statusCode: 400,
        message: item.message,
      });
    }
  }

  if (companyId && !mongoose.Types.ObjectId.isValid(companyId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  if (exhibitionTypeId && !mongoose.Types.ObjectId.isValid(exhibitionTypeId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition type ID.",
    });
  }

  //==============================
  // Validate Master Data
  //==============================

  const [eventType, entryType, state, venue, company, exhibitionType] =
    await Promise.all([
      EventType.findById(eventTypeId),
      EntryType.findById(entryTypeId),
      State.findById(stateId),
      Venue.findById(venueId),
      companyId ? Company.findById(companyId) : null,
      exhibitionTypeId ? ExhibitionType.findById(exhibitionTypeId) : null,
    ]);

  if (!eventType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Event type not found.",
    });
  }
  if (!entryType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Entry type not found.",
    });
  }

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  if (!venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  if (companyId && !company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  if (exhibitionTypeId && !exhibitionType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition type not found.",
    });
  }

  //==============================
  // Duplicate Event Name
  //==============================

  const escapedEventName = eventName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingEventName = await Exhibition.findOne({
    eventName: {
      $regex: `^${escapedEventName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingEventName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Event name already exists.",
    });
  }

  //==============================
  // Duplicate Short Name
  //==============================

  const escapedShortName = eventShortName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingShortName = await Exhibition.findOne({
    eventShortName: {
      $regex: `^${escapedShortName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingShortName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Event short name already exists.",
    });
  }

  //==============================
  // Update Exhibition
  //==============================

  exhibition.eventTypeId = eventTypeId;
  exhibition.eventName = eventName.trim();
  exhibition.eventShortName = eventShortName.trim();
  exhibition.startDate = startDate;
  exhibition.endDate = endDate;
  exhibition.month = month.trim();
  exhibition.year = year.trim();
  exhibition.entryTypeId = entryTypeId;
  exhibition.city = city.trim();
  exhibition.stateId = stateId;
  exhibition.venueId = venueId;
  exhibition.website = website.trim();
  exhibition.companyId = companyId?.trim() || null;
  exhibition.exhibitionTypeId = exhibitionTypeId?.trim() || null;

  exhibition.frequency = frequency?.trim() || null;
  exhibition.aboutExhibition = aboutExhibition?.trim() || null;
  exhibition.exhibitorProfile = exhibitorProfile?.trim() || null;
  exhibition.speciality = speciality?.trim() || null;
  exhibition.visitorProfile = visitorProfile?.trim() || null;

  //==============================
  // Replace Event Logo
  //==============================

  if (req.file) {
    // Delete old logo from S3

    if (exhibition.uploadEventLogo) {
      await deleteS3Object(exhibition.uploadEventLogo);
    }

    // Save new logo

    exhibition.uploadEventLogo = req.file.location;
  }

  //==============================
  // Audit Information
  //==============================

  exhibition.updatedBy = req.user._id;

  //==============================
  // Save Exhibition
  //==============================

  await exhibition.save();

  //==============================
  // Populate
  //==============================

  const populatedExhibition = await populateExhibition(
    Exhibition.findById(exhibition._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("exhibitions*");
  await deleteCacheByPattern("exhibition*");

  return successResponse(res, {
    message: "Exhibition updated successfully.",
    data: populatedExhibition,
  });
});

//==============================
// Delete Exhibition
//==============================
export const deleteExhibition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Exhibition ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition ID.",
    });
  }

  // Find Exhibition

  const exhibition = await Exhibition.findById(id);

  if (!exhibition) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (exhibition.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this exhibition.",
      });
    }

    if (exhibition.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending exhibition.",
      });
    }
  }

  // Delete Event Logo from S3

  if (exhibition.uploadEventLogo) {
    await deleteS3Object(exhibition.uploadEventLogo);
  }

  // Delete Exhibition

  await exhibition.deleteOne();

  // Clear Cache

  await deleteCacheByPattern("exhibitions*");
  await deleteCacheByPattern("exhibition*");

  return successResponse(res, {
    message: "Exhibition deleted successfully.",
  });
});

//==============================
// Approve Exhibition
//==============================
export const approveExhibition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Exhibition ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition ID.",
    });
  }

  // Find Exhibition

  const exhibition = await Exhibition.findById(id);

  if (!exhibition) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition not found.",
    });
  }

  // Check Status

  if (exhibition.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Exhibition is already approved.",
    });
  }

  if (exhibition.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected exhibition cannot be approved.",
    });
  }

  // Approve Exhibition

  exhibition.status = "approved";
  exhibition.approvedBy = req.user._id;
  exhibition.approvedAt = new Date();

  // Clear Rejection Info

  exhibition.rejectedBy = null;
  exhibition.rejectedAt = null;
  exhibition.rejectionReason = null;

  // Audit

  exhibition.updatedBy = req.user._id;

  await exhibition.save();

  // Populate

  const populatedExhibition = await populateExhibition(
    Exhibition.findById(exhibition._id),
  );

  // Clear Cache

  await deleteCacheByPattern("exhibitions*");
  await deleteCacheByPattern("exhibition*");

  return successResponse(res, {
    message: "Exhibition approved successfully.",
    data: populatedExhibition,
  });
});

//==============================
// Reject Exhibition
//==============================
export const rejectExhibition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  // Validate Exhibition ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid exhibition ID.",
    });
  }

  // Validate Rejection Reason

  if (!rejectionReason?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejection reason is required.",
    });
  }

  // Find Exhibition

  const exhibition = await Exhibition.findById(id);

  if (!exhibition) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Exhibition not found.",
    });
  }

  // Check Status

  if (exhibition.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Exhibition is already rejected.",
    });
  }

  if (exhibition.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved exhibition cannot be rejected.",
    });
  }

  // Reject Exhibition

  exhibition.status = "rejected";
  exhibition.rejectedBy = req.user._id;
  exhibition.rejectedAt = new Date();
  exhibition.rejectionReason = rejectionReason.trim();

  // Clear Approval Info

  exhibition.approvedBy = null;
  exhibition.approvedAt = null;

  // Audit

  exhibition.updatedBy = req.user._id;

  await exhibition.save();

  // Populate

  const populatedExhibition = await populateExhibition(
    Exhibition.findById(exhibition._id),
  );

  // Clear Cache

  await deleteCacheByPattern("exhibitions*");
  await deleteCacheByPattern("exhibition*");

  return successResponse(res, {
    message: "Exhibition rejected successfully.",
    data: populatedExhibition,
  });
});
