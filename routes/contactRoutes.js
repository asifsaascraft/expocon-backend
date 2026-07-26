import express from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  approveContact,
  rejectContact,
} from "../controllers/contactController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

//==========================================
// Contact Routes
//==========================================

// Create Contact
router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  createContact,
);

// Get All Contacts
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getContacts,
);

// Get Contact By ID
router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getContactById,
);

// Update Contact
router.put(
  "/:id",
  protect,
  authorize("admin", "staff"),
  updateContact,
);

// Delete Contact
router.delete(
  "/:id",
  protect,
  authorize("admin", "staff"),
  deleteContact,
);

// Approve Contact
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveContact,
);

// Reject Contact
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectContact,
);

export default router;