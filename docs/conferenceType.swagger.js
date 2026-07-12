import {
  createConferenceTypeExample,
  updateConferenceTypeExample,
} from "./examples.js";

const conferenceTypePaths = {
  //==============================
  // Create Conference Type
  //==============================
  "/conference-types": {
    post: {
      tags: ["Conference Type"],

      summary: "Create Conference Type",

      description:
        "Create a new conference type. Admin only.",

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
                "#/components/schemas/CreateConferenceTypeRequest",
            },

            example: createConferenceTypeExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Conference type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Conference type already exists.",
        },
      },
    },

    //==============================
    // Get Conference Types
    //==============================
    get: {
      tags: ["Conference Type"],

      summary: "Get Conference Types",

      description:
        "Get paginated conference types with search, sorting and pagination.",

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
            "Conference types fetched successfully.",
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
  "/conference-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Conference Type"],

      summary: "Get Conference Type By ID",

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
            "Conference type fetched successfully.",
        },

        404: {
          description:
            "Conference type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Conference Type"],

      summary: "Update Conference Type",

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
                "#/components/schemas/UpdateConferenceTypeRequest",
            },

            example:
              updateConferenceTypeExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Conference type updated successfully.",
        },

        404: {
          description:
            "Conference type not found.",
        },

        409: {
          description:
            "Conference type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Conference Type"],

      summary: "Delete Conference Type",

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
            "Conference type deleted successfully.",
        },

        404: {
          description:
            "Conference type not found.",
        },
      },
    },
  },
};

export default conferenceTypePaths;