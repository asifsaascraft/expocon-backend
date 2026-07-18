import mongoose from "mongoose";
import Company from "../models/Company.js";
import CompanyType from "../models/CompanyType.js";
import State from "../models/State.js";

import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { deleteCacheByPattern } from "../utils/redisCache.js";
import { getCache, setCache } from "../utils/redisCache.js";

import { getPagination, buildPaginationMeta } from "../utils/pagination.js";
import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";
import deleteS3Object from "../utils/deleteS3Object.js";

//==============================
// Company Populate
//==============================
const populateCompany = (query) =>
  query
    .populate("companyTypeId", "companyTypeName")
    .populate("stateId", "state")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");

//==============================
// Create Company
//==============================
export const createCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    companyEmail,
    companyTypeId,
    stateId,
    city,
    address,
    website,
    featured,
    mapLink,
    phone,
    mobile,
  } = req.body;

  // Validate Required Fields

  if (
    !companyName?.trim() ||
    !companyEmail?.trim() ||
    !companyTypeId ||
    !stateId ||
    !city?.trim() ||
    !address?.trim() ||
    !website?.trim()
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  // Validate ObjectIds

  if (!mongoose.Types.ObjectId.isValid(companyTypeId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company type ID.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(stateId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Check Company Type
  const [companyType, state] = await Promise.all([
    CompanyType.findById(companyTypeId),
    State.findById(stateId),
  ]);

  if (!companyType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company type not found.",
    });
  }

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }
  // Duplicate Company Name

  const escapedCompanyName = companyName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingCompanyName = await Company.findOne({
    companyName: {
      $regex: `^${escapedCompanyName}$`,
      $options: "i",
    },
  });

  if (existingCompanyName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Company name already exists.",
    });
  }

  // Duplicate Email

  const existingEmail = await Company.findOne({
    companyEmail: companyEmail.trim().toLowerCase(),
  });

  if (existingEmail) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Company email already exists.",
    });
  }

  // Duplicate Mobile

  if (mobile?.trim()) {
    const existingMobile = await Company.findOne({
      mobile: mobile.trim(),
    });

    if (existingMobile) {
      return errorResponse(res, {
        statusCode: 409,
        message: "Mobile number already exists.",
      });
    }
  }

  // Prepare Data

  const companyData = {
    companyName: companyName.trim(),
    companyEmail: companyEmail.trim().toLowerCase(),
    companyTypeId,
    stateId,
    city: city.trim(),
    address: address.trim(),
    website: website.trim(),
    featured: featured !== undefined ? featured === "true" : true,
    mapLink: mapLink?.trim() || null,
    phone: phone?.trim() || null,
    mobile: mobile?.trim() || null,
    uploadLogo: req.file ? req.file.location : null,
    createdBy: req.user._id,
  };

  // Admin -> Auto Approve

  if (req.user.role === "admin") {
    companyData.status = "approved";
    companyData.approvedBy = req.user._id;
    companyData.approvedAt = new Date();
  } else {
    companyData.status = "pending";
  }

  // Create Company

  const company = await Company.create(companyData);

  const populatedCompany = await populateCompany(Company.findById(company._id));

  // Clear Cache

  await deleteCacheByPattern("companies*");
  await deleteCacheByPattern("company*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Company created successfully."
        : "Company submitted successfully and is awaiting admin approval.",
    data: populatedCompany,
  });
});

//==============================
// Get Companies
//==============================
export const getCompanies = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "companyName",
    "companyEmail",
    "city",
    "mobile",
    "phone",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "featured",
    "companyTypeId",
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

  const cacheKey = `companies:${JSON.stringify({
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
      message: "Companies fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  // MongoDB

  const [companies, total] = await Promise.all([
    populateCompany(Company.find(query)).sort(sort).skip(skip).limit(limit),

    Company.countDocuments(query),
  ]);

  // Pagination

  const pagination = buildPaginationMeta(total, page, limit);

  // Save Cache

  await setCache(
    cacheKey,
    {
      data: companies,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Companies fetched successfully.",
    data: companies,
    pagination,
  });
});

//==============================
// Get Company By ID
//==============================
export const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  // Cache Key

  const cacheKey = `company:${id}:${req.user.role}:${req.user._id}`;

  // Check Cache

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Company fetched successfully (from cache).",
      data: cachedData,
    });
  }

  // Find Company

  const company = await populateCompany(Company.findById(id));

  if (!company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    const isOwner =
      company.createdBy &&
      company.createdBy._id.toString() === req.user._id.toString();

    const isApproved = company.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to view this company.",
      });
    }
  }

  // Save Cache

  await setCache(cacheKey, company, 3600);

  return successResponse(res, {
    message: "Company fetched successfully.",
    data: company,
  });
});

//==============================
// Update Company
//==============================
export const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    companyName,
    companyEmail,
    companyTypeId,
    stateId,
    city,
    address,
    website,
    featured,
    mapLink,
    phone,
    mobile,
  } = req.body;

  // Validate Company ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  // Find Company

  const company = await Company.findById(id);

  if (!company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (company.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this company.",
      });
    }

    if (company.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending company.",
      });
    }
  }

  // Validate Required Fields

  if (
    !companyName?.trim() ||
    !companyEmail?.trim() ||
    !companyTypeId ||
    !stateId ||
    !city?.trim() ||
    !address?.trim() ||
    !website?.trim()
  ) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please provide all required fields.",
    });
  }

  // Validate ObjectIds

  if (!mongoose.Types.ObjectId.isValid(companyTypeId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company type ID.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(stateId)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid state ID.",
    });
  }

  // Validate Company Type & State

  const [companyType, state] = await Promise.all([
    CompanyType.findById(companyTypeId),
    State.findById(stateId),
  ]);

  if (!companyType) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company type not found.",
    });
  }

  if (!state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  // Duplicate Company Name

  const escapedCompanyName = companyName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingCompanyName = await Company.findOne({
    companyName: {
      $regex: `^${escapedCompanyName}$`,
      $options: "i",
    },
    _id: {
      $ne: id,
    },
  });

  if (existingCompanyName) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Company name already exists.",
    });
  }

  // Duplicate Email

  const existingEmail = await Company.findOne({
    companyEmail: companyEmail.trim().toLowerCase(),
    _id: {
      $ne: id,
    },
  });

  if (existingEmail) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Company email already exists.",
    });
  }

  // Duplicate Mobile

  if (mobile?.trim()) {
    const existingMobile = await Company.findOne({
      mobile: mobile.trim(),
      _id: {
        $ne: id,
      },
    });

    if (existingMobile) {
      return errorResponse(res, {
        statusCode: 409,
        message: "Mobile number already exists.",
      });
    }
  }

  // Update Company

  company.companyName = companyName.trim();
  company.companyEmail = companyEmail.trim().toLowerCase();
  company.companyTypeId = companyTypeId;
  company.stateId = stateId;
  company.city = city.trim();
  company.address = address.trim();
  company.website = website.trim();
  company.featured =
    featured !== undefined ? featured === "true" : company.featured;
  company.mapLink = mapLink?.trim() || null;
  company.phone = phone?.trim() || null;
  company.mobile = mobile?.trim() || null;

  if (req.file) {
    // Delete old logo from S3
    if (company.uploadLogo) {
      await deleteS3Object(company.uploadLogo);
    }
    // Save new logo
    company.uploadLogo = req.file.location;
  }
  // Audit
  company.updatedBy = req.user._id;

  // Save
  await company.save();

  // Populate
  const populatedCompany = await populateCompany(Company.findById(company._id));

  // Clear Cache
  await deleteCacheByPattern("companies*");
  await deleteCacheByPattern("company*");

  return successResponse(res, {
    message: "Company updated successfully.",
    data: populatedCompany,
  });
});

//==============================
// Delete Company
//==============================
export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  // Find Company

  const company = await Company.findById(id);

  if (!company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (company.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this company.",
      });
    }

    if (company.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending company.",
      });
    }
  }

  // Delete Company Logo from S3
  if (company.uploadLogo) {
    await deleteS3Object(company.uploadLogo);
  }

  // Delete Company
  await company.deleteOne();

  // Clear Cache
  await deleteCacheByPattern("companies*");
  await deleteCacheByPattern("company*");

  return successResponse(res, {
    message: "Company deleted successfully.",
  });
});


//==============================
// Approve Company
//==============================
export const approveCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Company ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  // Find Company

  const company = await Company.findById(id);

  if (!company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  // Check Status

  if (company.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Company is already approved.",
    });
  }

  if (company.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected company cannot be approved.",
    });
  }

  // Approve Company

  company.status = "approved";
  company.approvedBy = req.user._id;
  company.approvedAt = new Date();

  // Clear Rejection Info

  company.rejectedBy = null;
  company.rejectedAt = null;

  // Track Update

  company.updatedBy = req.user._id;

  await company.save();

  // Populate

  const populatedCompany = await populateCompany(
    Company.findById(company._id)
  );

  // Clear Cache

  await deleteCacheByPattern("companies*");
  await deleteCacheByPattern("company*");

  return successResponse(res, {
    message: "Company approved successfully.",
    data: populatedCompany,
  });
});


//==============================
// Reject Company
//==============================
export const rejectCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Company ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid company ID.",
    });
  }

  // Find Company

  const company = await Company.findById(id);

  if (!company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  // Check Status

  if (company.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Company is already rejected.",
    });
  }

  if (company.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved company cannot be rejected.",
    });
  }

  // Reject Company

  company.status = "rejected";
  company.rejectedBy = req.user._id;
  company.rejectedAt = new Date();

  // Clear Approval Info

  company.approvedBy = null;
  company.approvedAt = null;

  // Track Update

  company.updatedBy = req.user._id;

  await company.save();

  // Populate

  const populatedCompany = await populateCompany(
    Company.findById(company._id)
  );

  // Clear Cache

  await deleteCacheByPattern("companies*");
  await deleteCacheByPattern("company*");

  return successResponse(res, {
    message: "Company rejected successfully.",
    data: populatedCompany,
  });
});