import {
  createMonthExample,
  updateMonthExample,
} from "./examples.js";

const monthPaths = {
  //==============================
  // Create Month
  //==============================
  "/months": {
    post: {
      tags: ["Month"],

      summary: "Create Month",

      description:
        "Create a new month. Admin only.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/CreateMonthRequest",
            },

            example: createMonthExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Month created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Month already exists.",
        },
      },
    },

    //==============================
    // Get Months
    //==============================
    get: {
      tags: ["Month"],

      summary: "Get Months",

      description:
        "Get paginated months with search, sorting and pagination.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "query",

          name: "page",

          schema: {
            type: "integer",
            default: 1,
          },
        },

        {
          in: "query",

          name: "limit",

          schema: {
            type: "integer",
            default: 20,
          },
        },

        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "createdAt",
          },
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",
            enum: ["asc", "desc"],
            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Months fetched successfully.",
        },

        401: {
          description: "Unauthorized.",
        },
      },
    },
  },

  //==============================
  // Get / Update / Delete By ID
  //==============================
  "/months/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Month"],

      summary: "Get Month By ID",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "path",

          name: "id",

          required: true,

          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Month fetched successfully.",
        },

        404: {
          description:
            "Month not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Month"],

      summary: "Update Month",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "path",

          name: "id",

          required: true,

          schema: {
            type: "string",
          },
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/UpdateMonthRequest",
            },

            example: updateMonthExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Month updated successfully.",
        },

        404: {
          description:
            "Month not found.",
        },

        409: {
          description:
            "Month already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Month"],

      summary: "Delete Month",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "path",

          name: "id",

          required: true,

          schema: {
            type: "string",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Month deleted successfully.",
        },

        404: {
          description:
            "Month not found.",
        },
      },
    },
  },
};

export default monthPaths;