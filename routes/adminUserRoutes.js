import express from "express";

import {
  getAllUsers,
  getAllStaffs,
  getAllPartners,
  createPartner,
  toggleUserSuspension,
} from "../controllers/adminUserController.js";

import protect from "../middlewares/protect.js";
import verifiedEmail from "../middlewares/verifiedEmail.js";
import checkStatus from "../middlewares/checkStatus.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(verifiedEmail);
router.use(checkStatus);
router.use(authorize("admin"));

// Users
router.get("/users", getAllUsers);

// Staffs
router.get("/staffs", getAllStaffs);

//  Partner
router.get("/partners", getAllPartners);

// Create Partner
router.post("/partners", createPartner);

// SUSPEND / UNSUSPEND (all role)
router.post(
  "/suspend/:id",
  toggleUserSuspension,
);

export default router;