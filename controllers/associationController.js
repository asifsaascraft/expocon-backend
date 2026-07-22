import mongoose from "mongoose";

import Association from "../models/Association.js";
import State from "../models/State.js";
import AssociationType from "../models/AssociationType.js";

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

//==============================
// Association Populate
//==============================
const populateAssociation = (query) =>
  query
    .populate("stateId", "state")
    .populate("associationTypeId", "associationTypeName")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");

//==============================
// Create Association
//==============================
export const createAssociation = asyncHandler(async (req, res) => {
  const {
    associationName,
    stateId,
    city,
    address,
    website,
    associationTypeId,
  } = req.body;

  //==============================
  // Validate Required Fields
  //==============================

  if (
    !associationName?.trim() ||
    !stateId ||
    !city?.trim() ||
    !address?.trim() ||
    !website?.trim() ||
    !associationTypeId
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
      value: stateId,
      message: "Invalid state ID.",
    },
    {
      value: associationTypeId,
      message: "Invalid association type ID.",
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

  //==============================
  // Validate Master Data
  //==============================

  const [state, associationType] = await Promise.all([
    State.findById(stateId),
    AssociationType.findById(associationTypeId),
  ]);

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  if (!associationType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association type not found.",
    });
  }

  //==============================
  // Duplicate Association Name
  //==============================

  const escapedAssociationName = associationName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingAssociation = await Association.findOne({
    associationName: {
      $regex: `^${escapedAssociationName}$`,
      $options: "i",
    },
  });

  if (existingAssociation) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Association name already exists.",
    });
  }

  //==============================
  // Prepare Data
  //==============================

  const associationData = {
    associationName: associationName.trim(),
    stateId,
    city: city.trim(),
    address: address.trim(),
    website: website.trim(),
    associationTypeId,
    createdBy: req.user._id,
  };

  //==============================
  // Admin Auto Approval
  //==============================

  if (req.user.role === "admin") {
    associationData.status = "approved";
    associationData.approvedBy = req.user._id;
    associationData.approvedAt = new Date();
  } else {
    associationData.status = "pending";
  }

  //==============================
  // Create Association
  //==============================

  const association = await Association.create(associationData);

  //==============================
  // Populate Association
  //==============================

  const populatedAssociation = await populateAssociation(
    Association.findById(association._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("associations*");
  await deleteCacheByPattern("association*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Association created successfully."
        : "Association submitted successfully and is awaiting admin approval.",
    data: populatedAssociation,
  });
});

//==============================
// Get Associations
//==============================
export const getAssociations = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "associationName",
    "city",
    "website",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "stateId",
    "associationTypeId",
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

  const cacheKey = `associations:${JSON.stringify({
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
      message: "Associations fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [associations, total] = await Promise.all([
    populateAssociation(Association.find(query))
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Association.countDocuments(query),
  ]);

  // Pagination

  const pagination = buildPaginationMeta(total, page, limit);

  // Save Cache

  await setCache(
    cacheKey,
    {
      data: associations,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Associations fetched successfully.",
    data: associations,
    pagination,
  });
});

//==============================
// Get Association By ID
//==============================
export const getAssociationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  // Cache Key

  const cacheKey = `association:${id}:${req.user.role}:${req.user._id}`;

  // Check Cache

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Association fetched successfully (from cache).",
      data: cachedData,
    });
  }

  // Find Association

  const association = await populateAssociation(
    Association.findById(id),
  );

  if (!association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    const isOwner =
      association.createdBy &&
      association.createdBy._id.toString() ===
        req.user._id.toString();

    const isApproved = association.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message:
          "You are not authorized to view this association.",
      });
    }
  }

  // Save Cache

  await setCache(cacheKey, association, 3600);

  return successResponse(res, {
    message: "Association fetched successfully.",
    data: association,
  });
});

//==============================
// Update Association
//==============================
export const updateAssociation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    associationName,
    stateId,
    city,
    address,
    website,
    associationTypeId,
  } = req.body;

  //==============================
  // Validate Association ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  //==============================
  // Find Association
  //==============================

  const association = await Association.findById(id);

  if (!association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    if (association.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this association.",
      });
    }

    if (association.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending association.",
      });
    }
  }

  //==============================
  // Validate Required Fields
  //==============================

  if (
    !associationName?.trim() ||
    !stateId ||
    !city?.trim() ||
    !address?.trim() ||
    !website?.trim() ||
    !associationTypeId
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
      value: stateId,
      message: "Invalid state ID.",
    },
    {
      value: associationTypeId,
      message: "Invalid association type ID.",
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

  //==============================
  // Validate Master Data
  //==============================

  const [state, associationType] = await Promise.all([
    State.findById(stateId),
    AssociationType.findById(associationTypeId),
  ]);

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  if (!associationType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association type not found.",
    });
  }

  //==============================
  // Duplicate Association Name
  //==============================

  const escapedAssociationName = associationName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingAssociation = await Association.findOne({
    associationName: {
      $regex: `^${escapedAssociationName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingAssociation) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Association name already exists.",
    });
  }

  //==============================
  // Update Association
  //==============================

  association.associationName = associationName.trim();
  association.stateId = stateId;
  association.city = city.trim();
  association.address = address.trim();
  association.website = website.trim();
  association.associationTypeId = associationTypeId;

  //==============================
  // Audit Information
  //==============================

  association.updatedBy = req.user._id;

  //==============================
  // Save Association
  //==============================

  await association.save();

  //==============================
  // Populate Association
  //==============================

  const populatedAssociation = await populateAssociation(
    Association.findById(association._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("associations*");
  await deleteCacheByPattern("association*");

  return successResponse(res, {
    message: "Association updated successfully.",
    data: populatedAssociation,
  });
});


//==============================
// Delete Association
//==============================
export const deleteAssociation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  // Find Association

  const association = await Association.findById(id);

  if (!association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (association.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this association.",
      });
    }

    if (association.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending association.",
      });
    }
  }

  // Delete Association

  await association.deleteOne();

  // Clear Cache

  await deleteCacheByPattern("associations*");
  await deleteCacheByPattern("association*");

  return successResponse(res, {
    message: "Association deleted successfully.",
  });
});

//==============================
// Approve Association
//==============================
export const approveAssociation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Association ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  // Find Association

  const association = await Association.findById(id);

  if (!association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  // Check Status

  if (association.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Association is already approved.",
    });
  }

  if (association.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected association cannot be approved.",
    });
  }

  // Approve Association

  association.status = "approved";
  association.approvedBy = req.user._id;
  association.approvedAt = new Date();

  // Clear Rejection Info

  association.rejectedBy = null;
  association.rejectedAt = null;

  // Track Update

  association.updatedBy = req.user._id;

  await association.save();

  // Populate

  const populatedAssociation = await populateAssociation(
    Association.findById(association._id),
  );

  // Clear Cache

  await deleteCacheByPattern("associations*");
  await deleteCacheByPattern("association*");

  return successResponse(res, {
    message: "Association approved successfully.",
    data: populatedAssociation,
  });
});

//==============================
// Reject Association
//==============================
export const rejectAssociation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Association ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid association ID.",
    });
  }

  // Find Association

  const association = await Association.findById(id);

  if (!association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  // Check Status

  if (association.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Association is already rejected.",
    });
  }

  if (association.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved association cannot be rejected.",
    });
  }

  // Reject Association

  association.status = "rejected";
  association.rejectedBy = req.user._id;
  association.rejectedAt = new Date();

  // Clear Approval Info

  association.approvedBy = null;
  association.approvedAt = null;

  // Track Update

  association.updatedBy = req.user._id;

  await association.save();

  // Populate

  const populatedAssociation = await populateAssociation(
    Association.findById(association._id),
  );

  // Clear Cache

  await deleteCacheByPattern("associations*");
  await deleteCacheByPattern("association*");

  return successResponse(res, {
    message: "Association rejected successfully.",
    data: populatedAssociation,
  });
});