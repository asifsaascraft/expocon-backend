import express from "express";

import {
  getAllUsers,
  getAllStaffs,
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

export default router;