import mongoose from "mongoose";

import Contact from "../models/Contact.js";
import State from "../models/State.js";
import Company from "../models/Company.js";
import Venue from "../models/Venue.js";
import Association from "../models/Association.js";

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
// Contact Populate
//==============================
const populateContact = (query) =>
  query
    .populate("stateId", "state")
    .populate("companyId", "companyName")
    .populate("venueId", "venueName")
    .populate("associationId", "associationName")
    .populate("createdBy", "fullName email role")
    .populate("updatedBy", "fullName email role")
    .populate("approvedBy", "fullName email role")
    .populate("rejectedBy", "fullName email role");

//==============================
// Create Contact
//==============================
export const createContact = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    mobile,
    stateId,
    companyId,
    venueId,
    associationId,
  } = req.body;

  //==============================
  // Validate Required Fields
  //==============================

  if (!fullName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Full name is required.",
    });
  }

  //==============================
  // Validate ObjectIds
  //==============================

  const ids = [
    {
      value: stateId,
      message: "Invalid state ID.",
      required: false,
    },
    {
      value: companyId,
      message: "Invalid company ID.",
      required: false,
    },
    {
      value: venueId,
      message: "Invalid venue ID.",
      required: false,
    },
    {
      value: associationId,
      message: "Invalid association ID.",
      required: false,
    },
  ];

  for (const item of ids) {
    if (item.value && !mongoose.Types.ObjectId.isValid(item.value)) {
      return errorResponse(res, {
        statusCode: 400,
        message: item.message,
      });
    }
  }

  //==============================
  // Validate Master Data
  //==============================

  const [state, company, venue, association] = await Promise.all([
    stateId ? State.findById(stateId) : null,
    companyId ? Company.findById(companyId) : null,
    venueId ? Venue.findById(venueId) : null,
    associationId ? Association.findById(associationId) : null,
  ]);

  if (stateId && !state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  if (companyId && !company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  if (venueId && !venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  if (associationId && !association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }
  //==============================
  // Duplicate Email
  //==============================

  if (email?.trim()) {
    const existingEmail = await Contact.findOne({
      email: {
        $regex: `^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingEmail) {
      return errorResponse(res, {
        statusCode: 409,
        message: "Email already exists.",
      });
    }
  }

  //==============================
  // Duplicate Mobile
  //==============================

  if (mobile?.trim()) {
    const existingMobile = await Contact.findOne({
      mobile: mobile.trim(),
    });

    if (existingMobile) {
      return errorResponse(res, {
        statusCode: 409,
        message: "Mobile number already exists.",
      });
    }
  }

  //==============================
  // Prepare Data
  //==============================

  const contactData = {
    fullName: fullName.trim(),
    createdBy: req.user._id,
  };

  if (email?.trim()) {
    contactData.email = email.trim().toLowerCase();
  }

  if (mobile?.trim()) {
    contactData.mobile = mobile.trim();
  }

  if (stateId) {
    contactData.stateId = stateId;
  }

  if (companyId) {
    contactData.companyId = companyId;
  }

  if (venueId) {
    contactData.venueId = venueId;
  }

  if (associationId) {
    contactData.associationId = associationId;
  }

  //==============================
  // Admin Auto Approval
  //==============================

  if (req.user.role === "admin") {
    contactData.status = "approved";
    contactData.approvedBy = req.user._id;
    contactData.approvedAt = new Date();
  } else {
    contactData.status = "pending";
  }

  //==============================
  // Create Contact
  //==============================

  const contact = await Contact.create(contactData);

  //==============================
  // Populate Contact
  //==============================

  const populatedContact = await populateContact(Contact.findById(contact._id));

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("contacts*");
  await deleteCacheByPattern("contact*");

  return successResponse(res, {
    statusCode: 201,
    message:
      req.user.role === "admin"
        ? "Contact created successfully."
        : "Contact submitted successfully and is awaiting admin approval.",
    data: populatedContact,
  });
});

//==============================
// Get Contacts
//==============================
export const getContacts = asyncHandler(async (req, res) => {
  // Pagination

  const { page, limit, skip } = getPagination(req);

  // Search

  const searchQuery = buildSearchQuery(req, [
    "fullName",
    "email",
    "mobile",
  ]);

  // Filters

  const filtersQuery = buildFiltersQuery(req, [
    "status",
    "stateId",
    "companyId",
    "venueId",
    "associationId",
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

    // Staff cannot filter status manually

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

  const cacheKey = `contacts:${JSON.stringify({
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
      message: "Contacts fetched successfully (from cache).",
      data: cachedData.data,
      pagination: cachedData.pagination,
    });
  }

  //==============================
  // MongoDB
  //==============================

  const [contacts, total] = await Promise.all([
    populateContact(Contact.find(query))
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Contact.countDocuments(query),
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
      data: contacts,
      pagination,
    },
    3600,
  );

  return successResponse(res, {
    message: "Contacts fetched successfully.",
    data: contacts,
    pagination,
  });
});

//==============================
// Get Contact By ID
//==============================
export const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //==============================
  // Validate ObjectId
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid contact ID.",
    });
  }

  //==============================
  // Cache Key
  //==============================

  const cacheKey = `contact:${id}:${req.user.role}:${req.user._id}`;

  //==============================
  // Check Cache
  //==============================

  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return successResponse(res, {
      message: "Contact fetched successfully (from cache).",
      data: cachedData,
    });
  }

  //==============================
  // Find Contact
  //==============================

  const contact = await populateContact(Contact.findById(id));

  if (!contact) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Contact not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    const isOwner =
      contact.createdBy &&
      contact.createdBy._id.toString() === req.user._id.toString();

    const isApproved = contact.status === "approved";

    if (!isApproved && !isOwner) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to view this contact.",
      });
    }
  }

  //==============================
  // Save Cache
  //==============================

  await setCache(cacheKey, contact, 3600);

  return successResponse(res, {
    message: "Contact fetched successfully.",
    data: contact,
  });
});


//==============================
// Update Contact
//==============================
export const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    fullName,
    email,
    mobile,
    stateId,
    companyId,
    venueId,
    associationId,
  } = req.body;

  //==============================
  // Validate Contact ID
  //==============================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid contact ID.",
    });
  }

  //==============================
  // Find Contact
  //==============================

  const contact = await Contact.findById(id);

  if (!contact) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Contact not found.",
    });
  }

  //==============================
  // Staff Permission
  //==============================

  if (req.user.role === "staff") {
    if (contact.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to update this contact.",
      });
    }

    if (contact.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can update only your pending contact.",
      });
    }
  }

  //==============================
  // Validate Required Fields
  //==============================

  if (!fullName?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Full name is required.",
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
      value: companyId,
      message: "Invalid company ID.",
    },
    {
      value: venueId,
      message: "Invalid venue ID.",
    },
    {
      value: associationId,
      message: "Invalid association ID.",
    },
  ];

  for (const item of ids) {
    if (
      item.value &&
      !mongoose.Types.ObjectId.isValid(item.value)
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message: item.message,
      });
    }
  }

  //==============================
  // Validate Master Data
  //==============================

  const [
    state,
    company,
    venue,
    association,
  ] = await Promise.all([
    stateId ? State.findById(stateId) : null,
    companyId ? Company.findById(companyId) : null,
    venueId ? Venue.findById(venueId) : null,
    associationId
      ? Association.findById(associationId)
      : null,
  ]);

  if (stateId && !state) {
    return errorResponse(res, {
      statusCode: 404,
      message: "State not found.",
    });
  }

  if (companyId && !company) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Company not found.",
    });
  }

  if (venueId && !venue) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Venue not found.",
    });
  }

  if (associationId && !association) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Association not found.",
    });
  }

  //==============================
  // Duplicate Email
  //==============================

  if (email?.trim()) {
    const escapedEmail = email
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingEmail = await Contact.findOne({
      email: {
        $regex: `^${escapedEmail}$`,
        $options: "i",
      },
      _id: {
        $ne: id,
      },
    });

    if (existingEmail) {
      return errorResponse(res, {
        statusCode: 409,
        message: "Email already exists.",
      });
    }
  }

  //==============================
  // Duplicate Mobile
  //==============================

  if (mobile?.trim()) {
    const existingMobile = await Contact.findOne({
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

  //==============================
  // Update Contact
  //==============================

  contact.fullName = fullName.trim();
  contact.email = email?.trim()
    ? email.trim().toLowerCase()
    : null;
  contact.mobile = mobile?.trim() || null;
  contact.stateId = stateId || null;
  contact.companyId = companyId || null;
  contact.venueId = venueId || null;
  contact.associationId = associationId || null;

  //==============================
  // Audit Information
  //==============================

  contact.updatedBy = req.user._id;

  //==============================
  // Save Contact
  //==============================

  await contact.save();

  //==============================
  // Populate Contact
  //==============================

  const populatedContact = await populateContact(
    Contact.findById(contact._id),
  );

  //==============================
  // Clear Cache
  //==============================

  await deleteCacheByPattern("contacts*");
  await deleteCacheByPattern("contact*");

  return successResponse(res, {
    message: "Contact updated successfully.",
    data: populatedContact,
  });
});

//==============================
// Delete Contact
//==============================
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid contact ID.",
    });
  }

  // Find Contact

  const contact = await Contact.findById(id);

  if (!contact) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Contact not found.",
    });
  }

  // Staff Permission

  if (req.user.role === "staff") {
    if (contact.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: "You are not authorized to delete this contact.",
      });
    }

    if (contact.status !== "pending") {
      return errorResponse(res, {
        statusCode: 403,
        message: "You can delete only your pending contact.",
      });
    }
  }

  // Delete Contact

  await contact.deleteOne();

  // Clear Cache

  await deleteCacheByPattern("contacts*");
  await deleteCacheByPattern("contact*");

  return successResponse(res, {
    message: "Contact deleted successfully.",
  });
});

//==============================
// Approve Contact
//==============================
export const approveContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate Contact ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid contact ID.",
    });
  }

  // Find Contact

  const contact = await Contact.findById(id);

  if (!contact) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Contact not found.",
    });
  }

  // Check Status

  if (contact.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Contact is already approved.",
    });
  }

  if (contact.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejected contact cannot be approved.",
    });
  }

  // Approve Contact

  contact.status = "approved";
  contact.approvedBy = req.user._id;
  contact.approvedAt = new Date();

  // Clear Rejection Info

  contact.rejectedBy = null;
  contact.rejectedAt = null;
  contact.rejectionReason = null;

  // Track Update

  contact.updatedBy = req.user._id;

  await contact.save();

  // Populate Contact

  const populatedContact = await populateContact(
    Contact.findById(contact._id),
  );

  // Clear Cache

  await deleteCacheByPattern("contacts*");
  await deleteCacheByPattern("contact*");

  return successResponse(res, {
    message: "Contact approved successfully.",
    data: populatedContact,
  });
});

//==============================
// Reject Contact
//==============================
export const rejectContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  // Validate Contact ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid contact ID.",
    });
  }

  // Validate Rejection Reason

  if (!rejectionReason?.trim()) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Rejection reason is required.",
    });
  }

  // Find Contact

  const contact = await Contact.findById(id);

  if (!contact) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Contact not found.",
    });
  }

  // Check Status

  if (contact.status === "rejected") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Contact is already rejected.",
    });
  }

  if (contact.status === "approved") {
    return errorResponse(res, {
      statusCode: 400,
      message: "Approved contact cannot be rejected.",
    });
  }

  // Reject Contact

  contact.status = "rejected";
  contact.rejectedBy = req.user._id;
  contact.rejectedAt = new Date();
  contact.rejectionReason = rejectionReason.trim();

  // Clear Approval Info

  contact.approvedBy = null;
  contact.approvedAt = null;

  // Track Update

  contact.updatedBy = req.user._id;

  await contact.save();

  // Populate Contact

  const populatedContact = await populateContact(
    Contact.findById(contact._id),
  );

  // Clear Cache

  await deleteCacheByPattern("contacts*");
  await deleteCacheByPattern("contact*");

  return successResponse(res, {
    message: "Contact rejected successfully.",
    data: populatedContact,
  });
});