import swaggerJsdoc from "swagger-jsdoc";

import paths from "./index.js";
import schemas from "./schemas.js";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Expocon API",

      version: "1.0.0",

      description:
        "Official REST API documentation for the Expocon Backend.",
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,

        description: "Local Development",
      },

      {
        url: process.env.API_BASE_URL,

        description: "Production",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication APIs",
      },

      {
        name: "Users",
        description: "User Management APIs",
      },

      {
        name: "Partners",
        description: "Partner APIs",
      },

      {
        name: "Staff",
        description: "Staff APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },

      schemas,
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    paths,
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;