import express from "express";

import publicVenueRoutes from "./public/publicVenueRoutes.js";


const router = express.Router();


// =====================================
// Public Venue APIs
// =====================================
router.use(
  "/venues",
  publicVenueRoutes,
);


export default router;