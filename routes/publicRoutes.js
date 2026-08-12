import express from "express";

import publicVenueRoutes from "./public/publicVenueRoutes.js";
import publicStateRoutes from "./public/publicStateRoutes.js";

const router = express.Router();


// =====================================
// Public Venue APIs
// =====================================
router.use(
  "/venues",
  publicVenueRoutes,
);

// =====================================
// Public State APIs
// =====================================
router.use(
  "/states",
  publicStateRoutes,
);

export default router;