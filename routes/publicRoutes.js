import express from "express";

import publicVenueRoutes from "./public/publicVenueRoutes.js";
import publicStateRoutes from "./public/publicStateRoutes.js";
import publicCompanyRoutes from "./public/publicCompanyRoutes.js";
import publicCompanyTypeRoutes from "./public/publicCompanyTypeRoutes.js";
import publicExhibitionRoutes from "./public/publicExhibitionRoutes.js";
import publicConferenceRoutes from "./public/publicConferenceRoutes.js";

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

// =====================================
// Public Company Type APIs
// =====================================
router.use(
  "/company-types",
  publicCompanyTypeRoutes,
);


// =====================================
// Public Exhibition APIs
// =====================================
router.use(
  "/exhibitions",
  publicExhibitionRoutes,
);


// =====================================
// Public Conference APIs
// =====================================
router.use(
  "/conferences",
  publicConferenceRoutes,
);


export default router;