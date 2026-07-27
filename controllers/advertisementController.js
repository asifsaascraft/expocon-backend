import mongoose from "mongoose";

import Advertisement from "../models/Advertisement.js";
import AdvertisementLocation from "../models/AdvertisementLocation.js";

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
// Advertisement Populate
//==============================
const populateAdvertisement = (query) =>
  query
    .populate("advertisementLocationId", "advertisementLocationName")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");

//==============================
// Create Advertisement
//==============================
export const createAdvertisement = asyncHandler(async (req, res) => {
  const { advertisementLocationId } = req.body;

  //==============================
  // Validate Required Fields
  //==============================

  if (!advertisementLocationId) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  if (!req.file) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Advertisement logo is required.",
    });
  }

  //==============================
  // Validate ObjectId
  //==============================

  if (!mongoose.Types.ObjectId.isValid(advertisementLocationId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement location ID.",
    });
  }

  //==============================
  // Validate Advertisement Location
  //==============================

  const advertisementLocation =
    await AdvertisementLocation.findById(advertisementLocationId);

  if (!advertisementLocation) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement location not found.",
    });
  }

  //==============================
  // Prepare Data
  //==============================

  const advertisementData = {
    advertisementLocationId,
    uploadAdvertisementLogo: req.file.location,
    createdBy: req.user._id,
  };

  //==============================
  // Admin Auto Approval
  //==============================

  if (req.user.role === "admin") {
    advertisementData.status = "approved";
    advertisementData.approvedBy = req.user._id;
    advertisementData.approvedAt = new Date();
  } else {
    advertisementData.status = "pending";
  }

  //==============================
  // Create Advertisement
  //==============================

  const advertisement = await Advertisement.create(advertisementData);

  const populatedAdvertisement = await populateAdvertisement(
    Advertisement.findById(advertisement._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("advertisements*");
  await deleteCacheByPattern("advertisement*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Advertisement created successfully."
        : "Advertisement submitted successfully and is awaiting admin approval.",
    data: populatedAdvertisement,
  });
});


//==============================
// Get Advertisements
//==============================
export const getAdvertisements = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, []);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "advertisementLocationId",
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

  const cacheKey = `advertisements:${JSON.stringify({
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
      message: "Advertisements fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  //==============================
  // MongoDB
  //==============================

  const [advertisements, total] = await Promise.all([
    populateAdvertisement(Advertisement.find(query))
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Advertisement.countDocuments(query),
  ]);

  //==============================
  // Pagination
  //==============================

  const pagination = buildPaginationMeta(total, page, limit);

  //==============================
  // Save Cache
  //==============================

  await setCache(
    cacheKey,
    {
      data: advertisements,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Advertisements fetched successfully.",
    data: advertisements,
    pagination,
  });
});

//==============================
// Get Advertisement By ID
//==============================
export const getAdvertisementById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //==============================
  // Validate ObjectId
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement ID.",
    });
  }

  //==============================
  // Cache Key
  //==============================

  const cacheKey = `advertisement:${id}:${req.user.role}:${req.user._id}`;

  //==============================
  // Check Cache
  //==============================

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Advertisement fetched successfully (from cache).",
      data: cachedData,
    });
  }

  //==============================
  // Find Advertisement
  //==============================

  const advertisement = await populateAdvertisement(
    Advertisement.findById(id),
  );

  if (!advertisement) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    const isOwner =
      advertisement.createdBy &&
      advertisement.createdBy._id.toString() === req.user._id.toString();

    const isApproved = advertisement.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to view this advertisement.",
      });
    }
  }

  //==============================
  // Save Cache
  //==============================

  await setCache(cacheKey, advertisement, 3600);

  return successResponse(res, {
    message: "Advertisement fetched successfully.",
    data: advertisement,
  });
});


//==============================
// Update Advertisement
//==============================
export const updateAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { advertisementLocationId } = req.body;

  //==============================
  // Validate Advertisement ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement ID.",
    });
  }

  //==============================
  // Find Advertisement
  //==============================

  const advertisement = await Advertisement.findById(id);

  if (!advertisement) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    if (advertisement.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this advertisement.",
      });
    }

    if (advertisement.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending advertisement.",
      });
    }
  }

  //==============================
  // Validate Required Fields
  //==============================

  if (!advertisementLocationId) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  //==============================
  // Validate ObjectId
  //==============================

  if (!mongoose.Types.ObjectId.isValid(advertisementLocationId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement location ID.",
    });
  }

  //==============================
  // Validate Advertisement Location
  //==============================

  const advertisementLocation =
    await AdvertisementLocation.findById(advertisementLocationId);

  if (!advertisementLocation) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement location not found.",
    });
  }

  //==============================
  // Update Advertisement
  //==============================

  advertisement.advertisementLocationId = advertisementLocationId;

  //==============================
  // Replace Advertisement Logo
  //==============================

  if (req.file) {
    // Delete old logo from S3

    if (advertisement.uploadAdvertisementLogo) {
      await deleteS3Object(advertisement.uploadAdvertisementLogo);
    }

    // Save new logo

    advertisement.uploadAdvertisementLogo = req.file.location;
  }

  //==============================
  // Audit Information
  //==============================

  advertisement.updatedBy = req.user._id;

  //==============================
  // Save Advertisement
  //==============================

  await advertisement.save();

  //==============================
  // Populate
  //==============================

  const populatedAdvertisement = await populateAdvertisement(
    Advertisement.findById(advertisement._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("advertisements*");
  await deleteCacheByPattern("advertisement*");

  return successResponse(res, {
    message: "Advertisement updated successfully.",
    data: populatedAdvertisement,
  });
});

//==============================
// Delete Advertisement
//==============================
export const deleteAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //==============================
  // Validate Advertisement ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement ID.",
    });
  }

  //==============================
  // Find Advertisement
  //==============================

  const advertisement = await Advertisement.findById(id);

  if (!advertisement) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    if (advertisement.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this advertisement.",
      });
    }

    if (advertisement.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending advertisement.",
      });
    }
  }

  //==============================
  // Delete Advertisement Logo from S3
  //==============================

  if (advertisement.uploadAdvertisementLogo) {
    await deleteS3Object(advertisement.uploadAdvertisementLogo);
  }

  //==============================
  // Delete Advertisement
  //==============================

  await advertisement.deleteOne();

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("advertisements*");
  await deleteCacheByPattern("advertisement*");

  return successResponse(res, {
    message: "Advertisement deleted successfully.",
  });
});

//==============================
// Approve Advertisement
//==============================
export const approveAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //==============================
  // Validate Advertisement ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement ID.",
    });
  }

  //==============================
  // Find Advertisement
  //==============================

  const advertisement = await Advertisement.findById(id);

  if (!advertisement) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement not found.",
    });
  }

  //==============================
  // Check Status
  //==============================

  if (advertisement.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Advertisement is already approved.",
    });
  }

  if (advertisement.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected advertisement cannot be approved.",
    });
  }

  //==============================
  // Approve Advertisement
  //==============================

  advertisement.status = "approved";
  advertisement.approvedBy = req.user._id;
  advertisement.approvedAt = new Date();

  //==============================
  // Clear Rejection Info
  //==============================

  advertisement.rejectedBy = null;
  advertisement.rejectedAt = null;
  advertisement.rejectionReason = null;

  //==============================
  // Audit Information
  //==============================

  advertisement.updatedBy = req.user._id;

  await advertisement.save();

  //==============================
  // Populate
  //==============================

  const populatedAdvertisement = await populateAdvertisement(
    Advertisement.findById(advertisement._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("advertisements*");
  await deleteCacheByPattern("advertisement*");

  return successResponse(res, {
    message: "Advertisement approved successfully.",
    data: populatedAdvertisement,
  });
});

//==============================
// Reject Advertisement
//==============================
export const rejectAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  //==============================
  // Validate Advertisement ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid advertisement ID.",
    });
  }

  //==============================
  // Validate Rejection Reason
  //==============================

  if (!rejectionReason?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejection reason is required.",
    });
  }

  //==============================
  // Find Advertisement
  //==============================

  const advertisement = await Advertisement.findById(id);

  if (!advertisement) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Advertisement not found.",
    });
  }

  //==============================
  // Check Status
  //==============================

  if (advertisement.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Advertisement is already rejected.",
    });
  }

  if (advertisement.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved advertisement cannot be rejected.",
    });
  }

  //==============================
  // Reject Advertisement
  //==============================

  advertisement.status = "rejected";
  advertisement.rejectedBy = req.user._id;
  advertisement.rejectedAt = new Date();
  advertisement.rejectionReason = rejectionReason.trim();

  //==============================
  // Clear Approval Info
  //==============================

  advertisement.approvedBy = null;
  advertisement.approvedAt = null;

  //==============================
  // Audit Information
  //==============================

  advertisement.updatedBy = req.user._id;

  await advertisement.save();

  //==============================
  // Populate
  //==============================

  const populatedAdvertisement = await populateAdvertisement(
    Advertisement.findById(advertisement._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("advertisements*");
  await deleteCacheByPattern("advertisement*");

  return successResponse(res, {
    message: "Advertisement rejected successfully.",
    data: populatedAdvertisement,
  });
});