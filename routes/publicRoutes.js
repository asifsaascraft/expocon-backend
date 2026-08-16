import express from "express";

import publicVenueRoutes from "./public/publicVenueRoutes.js";
import publicStateRoutes from "./public/publicStateRoutes.js";
import publicCompanyRoutes from "./public/publicCompanyRoutes.js";

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

// =====================================
// Public Company APIs
// =====================================

router.use(
  "/companies",
  publicCompanyRoutes,
);



export default router;