import mongoose from "mongoose";

import Conference from "../models/Conference.js";
import ConferenceType from "../models/ConferenceType.js";
import EntryType from "../models/EntryType.js";
import State from "../models/State.js";
import Venue from "../models/Venue.js";
import Company from "../models/Company.js";
import ConferenceSegment from "../models/ConferenceSegment.js";
import Association from "../models/Association.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

import {
  deleteCacheByPattern,
  getCache,
  setCache,
} from "../utils/redisCache.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../utils/pagination.js";

import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";

import deleteS3Object from "../utils/deleteS3Object.js";

//==============================
// Conference Populate
//==============================

const populateConference = (query) =>
  query
    .populate("conferenceTypeId", "conferenceTypeName")
    .populate("entryTypeId", "entryTypeName")
    .populate("stateId", "state")
    .populate("venueId", "venueName")
    .populate("companyId", "companyName")
    .populate("conferenceSegmentId", "conferenceSegmentName")
    .populate("associationId", "associationName")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");


    //==============================
// Create Conference
//==============================
export const createConference = asyncHandler(async (req, res) => {
  const {
    conferenceTypeId,
    conferenceName,
    conferenceShortName,
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
    conferenceSegmentId,
    associationId,
    committeeMember,
    frequency,
    aboutConference,
  } = req.body;

  //==============================
  // Validate Required Fields
  //==============================

  if (
    !conferenceTypeId ||
    !conferenceName?.trim() ||
    !conferenceShortName?.trim() ||
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
      value: conferenceTypeId,
      message: "Invalid conference type ID.",
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

  if (
    conferenceSegmentId &&
    !mongoose.Types.ObjectId.isValid(conferenceSegmentId)
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference segment ID.",
    });
  }

  if (
    associationId &&
    !mongoose.Types.ObjectId.isValid(associationId)
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  //==============================
  // Validate Master Data
  //==============================

  const [
    conferenceType,
    entryType,
    state,
    venue,
    company,
    conferenceSegment,
    association,
  ] = await Promise.all([
    ConferenceType.findById(conferenceTypeId),
    EntryType.findById(entryTypeId),
    State.findById(stateId),
    Venue.findById(venueId),
    companyId ? Company.findById(companyId) : null,
    conferenceSegmentId
      ? ConferenceSegment.findById(conferenceSegmentId)
      : null,
    associationId
      ? Association.findById(associationId)
      : null,
  ]);

  if (!conferenceType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference type not found.",
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

  if (conferenceSegmentId && !conferenceSegment) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference segment not found.",
    });
  }

  if (associationId && !association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  //==============================
  // Duplicate Conference Name
  //==============================

  const escapedConferenceName = conferenceName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingConferenceName = await Conference.findOne({
    conferenceName: {
      $regex: `^${escapedConferenceName}$`,
      $options: "i",
    },
  });

  if (existingConferenceName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Conference name already exists.",
    });
  }

  //==============================
  // Duplicate Conference Short Name
  //==============================

  const escapedConferenceShortName = conferenceShortName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingConferenceShortName =
    await Conference.findOne({
      conferenceShortName: {
        $regex: `^${escapedConferenceShortName}$`,
        $options: "i",
      },
    });

  if (existingConferenceShortName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Conference short name already exists.",
    });
  }

  //==============================
  // Prepare Data
  //==============================

  const conferenceData = {
    conferenceTypeId,
    conferenceName: conferenceName.trim(),
    conferenceShortName: conferenceShortName.trim(),
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
    conferenceSegmentId:
      conferenceSegmentId?.trim() || null,
    associationId: associationId?.trim() || null,
    uploadConferenceLogo: req.file
      ? req.file.location
      : null,
    committeeMember:
      committeeMember?.trim() || null,
    frequency: frequency?.trim() || null,
    aboutConference:
      aboutConference?.trim() || null,
    createdBy: req.user._id,
  };

  //==============================
  // Admin Auto Approval
  //==============================

  if (req.user.role === "admin") {
    conferenceData.status = "approved";
    conferenceData.approvedBy = req.user._id;
    conferenceData.approvedAt = new Date();
  } else {
    conferenceData.status = "pending";
  }

  //==============================
  // Create Conference
  //==============================

  const conference = await Conference.create(
    conferenceData,
  );

  //==============================
  // Populate Conference
  //==============================

  const populatedConference =
    await populateConference(
      Conference.findById(conference._id),
    );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("conferences*");
  await deleteCacheByPattern("conference*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Conference created successfully."
        : "Conference submitted successfully and is awaiting admin approval.",
    data: populatedConference,
  });
});


//==============================
// Get Conferences
//==============================
export const getConferences = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "conferenceName",
    "conferenceShortName",
    "city",
    "website",
    "month",
    "year",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "conferenceTypeId",
    "stateId",
    "venueId",
    "companyId",
    "conferenceSegmentId",
    "associationId",
    "entryTypeId",
  ]);

  //==============================
  // Role Based Query
  //==============================

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

  //==============================
  // Final Query
  //==============================

  const query = {
    ...roleQuery,
    ...searchQuery,
    ...filtersQuery,
  };

  //==============================
  // Sorting
  //==============================

  const sort = buildSortQuery(req);

  //==============================
  // Cache Key
  //==============================

  const cacheKey = `conferences:${JSON.stringify({
    role: req.user.role,
    userId: req.user._id,
    page,
    limit,
    query,
    sort,
  })}`;

  //==============================
  // Check Cache
  //==============================

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Conferences fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  //==============================
  // MongoDB
  //==============================

  const [conferences, total] = await Promise.all([
    populateConference(
      Conference.find(query),
    )
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Conference.countDocuments(query),
  ]);

  //==============================
  // Pagination
  //==============================

  const pagination = buildPaginationMeta(
    total,
    page,
    limit,
  );

  //==============================
  // Save Cache
  //==============================

  await setCache(
    cacheKey,
    {
      data: conferences,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Conferences fetched successfully.",
    data: conferences,
    pagination,
  });
});

//==============================
// Get Conference By ID
//==============================
export const getConferenceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //==============================
  // Validate ObjectId
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference ID.",
    });
  }

  //==============================
  // Cache Key
  //==============================

  const cacheKey = `conference:${id}:${req.user.role}:${req.user._id}`;

  //==============================
  // Check Cache
  //==============================

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Conference fetched successfully (from cache).",
      data: cachedData,
    });
  }

  //==============================
  // Find Conference
  //==============================

  const conference = await populateConference(
    Conference.findById(id),
  );

  if (!conference) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    const isOwner =
      conference.createdBy &&
      conference.createdBy._id.toString() ===
        req.user._id.toString();

    const isApproved =
      conference.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message:
          "You are not authorized to view this conference.",
      });
    }
  }

  //==============================
  // Save Cache
  //==============================

  await setCache(
    cacheKey,
    conference,
    3600,
  );

  return successResponse(res, {
    message: "Conference fetched successfully.",
    data: conference,
  });
});


//==============================
// Update Conference
//==============================
export const updateConference = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    conferenceTypeId,
    conferenceName,
    conferenceShortName,
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
    conferenceSegmentId,
    associationId,
    committeeMember,
    frequency,
    aboutConference,
  } = req.body;

  //==============================
  // Validate Conference ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference ID.",
    });
  }

  //==============================
  // Find Conference
  //==============================

  const conference = await Conference.findById(id);

  if (!conference) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    if (conference.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this conference.",
      });
    }

    if (conference.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending conference.",
      });
    }
  }

  //==============================
  // Validate Required Fields
  //==============================

  if (
    !conferenceTypeId ||
    !conferenceName?.trim() ||
    !conferenceShortName?.trim() ||
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
      value: conferenceTypeId,
      message: "Invalid conference type ID.",
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

  if (
    conferenceSegmentId &&
    !mongoose.Types.ObjectId.isValid(conferenceSegmentId)
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference segment ID.",
    });
  }

  if (
    associationId &&
    !mongoose.Types.ObjectId.isValid(associationId)
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  //==============================
  // Validate Master Data
  //==============================

  const [
    conferenceType,
    entryType,
    state,
    venue,
    company,
    conferenceSegment,
    association,
  ] = await Promise.all([
    ConferenceType.findById(conferenceTypeId),
    EntryType.findById(entryTypeId),
    State.findById(stateId),
    Venue.findById(venueId),
    companyId ? Company.findById(companyId) : null,
    conferenceSegmentId
      ? ConferenceSegment.findById(conferenceSegmentId)
      : null,
    associationId
      ? Association.findById(associationId)
      : null,
  ]);

  if (!conferenceType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference type not found.",
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

  if (conferenceSegmentId && !conferenceSegment) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference segment not found.",
    });
  }

  if (associationId && !association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  //==============================
  // Duplicate Conference Name
  //==============================

  const escapedConferenceName = conferenceName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingConferenceName = await Conference.findOne({
    conferenceName: {
      $regex: `^${escapedConferenceName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingConferenceName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Conference name already exists.",
    });
  }

  //==============================
  // Duplicate Conference Short Name
  //==============================

  const escapedConferenceShortName = conferenceShortName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingConferenceShortName = await Conference.findOne({
    conferenceShortName: {
      $regex: `^${escapedConferenceShortName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingConferenceShortName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Conference short name already exists.",
    });
  }

  //==============================
  // Update Conference
  //==============================

  conference.conferenceTypeId = conferenceTypeId;
  conference.conferenceName = conferenceName.trim();
  conference.conferenceShortName = conferenceShortName.trim();
  conference.startDate = startDate;
  conference.endDate = endDate;
  conference.month = month.trim();
  conference.year = year.trim();
  conference.entryTypeId = entryTypeId;
  conference.city = city.trim();
  conference.stateId = stateId;
  conference.venueId = venueId;
  conference.website = website.trim();
  conference.companyId = companyId?.trim() || null;
  conference.conferenceSegmentId =
    conferenceSegmentId?.trim() || null;
  conference.associationId =
    associationId?.trim() || null;
  conference.committeeMember =
    committeeMember?.trim() || null;
  conference.frequency = frequency?.trim() || null;
  conference.aboutConference =
    aboutConference?.trim() || null;

  //==============================
  // Replace Conference Logo
  //==============================

  if (req.file) {
    if (conference.uploadConferenceLogo) {
      await deleteS3Object(conference.uploadConferenceLogo);
    }

    conference.uploadConferenceLogo = req.file.location;
  }

  //==============================
  // Audit Information
  //==============================

  conference.updatedBy = req.user._id;

  //==============================
  // Save Conference
  //==============================

  await conference.save();

  //==============================
  // Populate
  //==============================

  const populatedConference = await populateConference(
    Conference.findById(conference._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("conferences*");
  await deleteCacheByPattern("conference*");

  return successResponse(res, {
    message: "Conference updated successfully.",
    data: populatedConference,
  });
});


//==============================
// Delete Conference
//==============================
export const deleteConference = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Conference ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference ID.",
    });
  }

  // Find Conference

  const conference = await Conference.findById(id);

  if (!conference) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (conference.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this conference.",
      });
    }

    if (conference.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending conference.",
      });
    }
  }

  // Delete Conference Logo from S3

  if (conference.uploadConferenceLogo) {
    await deleteS3Object(conference.uploadConferenceLogo);
  }

  // Delete Conference

  await conference.deleteOne();

  // Clear Cache

  await deleteCacheByPattern("conferences*");
  await deleteCacheByPattern("conference*");

  return successResponse(res, {
    message: "Conference deleted successfully.",
  });
});

//==============================
// Approve Conference
//==============================
export const approveConference = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Conference ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference ID.",
    });
  }

  // Find Conference

  const conference = await Conference.findById(id);

  if (!conference) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference not found.",
    });
  }

  // Check Status

  if (conference.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Conference is already approved.",
    });
  }

  if (conference.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected conference cannot be approved.",
    });
  }

  // Approve Conference

  conference.status = "approved";
  conference.approvedBy = req.user._id;
  conference.approvedAt = new Date();

  // Clear Rejection Info

  conference.rejectedBy = null;
  conference.rejectedAt = null;
  conference.rejectionReason = null;

  // Audit

  conference.updatedBy = req.user._id;

  await conference.save();

  // Populate

  const populatedConference = await populateConference(
    Conference.findById(conference._id),
  );

  // Clear Cache

  await deleteCacheByPattern("conferences*");
  await deleteCacheByPattern("conference*");

  return successResponse(res, {
    message: "Conference approved successfully.",
    data: populatedConference,
  });
});

//==============================
// Reject Conference
//==============================
export const rejectConference = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  // Validate Conference ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid conference ID.",
    });
  }

  // Validate Rejection Reason

  if (!rejectionReason?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejection reason is required.",
    });
  }

  // Find Conference

  const conference = await Conference.findById(id);

  if (!conference) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Conference not found.",
    });
  }

  // Check Status

  if (conference.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Conference is already rejected.",
    });
  }

  if (conference.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved conference cannot be rejected.",
    });
  }

  // Reject Conference

  conference.status = "rejected";
  conference.rejectedBy = req.user._id;
  conference.rejectedAt = new Date();
  conference.rejectionReason = rejectionReason.trim();

  // Clear Approval Info

  conference.approvedBy = null;
  conference.approvedAt = null;

  // Audit

  conference.updatedBy = req.user._id;

  await conference.save();

  // Populate

  const populatedConference = await populateConference(
    Conference.findById(conference._id),
  );

  // Clear Cache

  await deleteCacheByPattern("conferences*");
  await deleteCacheByPattern("conference*");

  return successResponse(res, {
    message: "Conference rejected successfully.",
    data: populatedConference,
  });
});