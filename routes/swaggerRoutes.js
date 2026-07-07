import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "../docs/swagger.js";

const router = express.Router();

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,

    customSiteTitle: "Expocon API Documentation",

    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

export default router;