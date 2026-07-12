import {
  createExhibitionTypeExample,
  updateExhibitionTypeExample,
} from "./examples.js";

const exhibitionTypePaths = {
  //==============================
  // Create Exhibition Type
  //==============================
  "/exhibition-types": {
    post: {
      tags: ["Exhibition Type"],

      summary: "Create Exhibition Type",

      description:
        "Create a new exhibition type. Admin only.",

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
                "#/components/schemas/CreateExhibitionTypeRequest",
            },

            example: createExhibitionTypeExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Exhibition type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Exhibition type already exists.",
        },
      },
    },

    //==============================
    // Get Exhibition Types
    //==============================
    get: {
      tags: ["Exhibition Type"],

      summary: "Get Exhibition Types",

      description:
        "Get paginated exhibition types with search, sorting and pagination.",

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
            "Exhibition types fetched successfully.",
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
  "/exhibition-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Exhibition Type"],

      summary: "Get Exhibition Type By ID",

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
            "Exhibition type fetched successfully.",
        },

        404: {
          description:
            "Exhibition type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Exhibition Type"],

      summary: "Update Exhibition Type",

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
                "#/components/schemas/UpdateExhibitionTypeRequest",
            },

            example: updateExhibitionTypeExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Exhibition type updated successfully.",
        },

        404: {
          description:
            "Exhibition type not found.",
        },

        409: {
          description:
            "Exhibition type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Exhibition Type"],

      summary: "Delete Exhibition Type",

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
            "Exhibition type deleted successfully.",
        },

        404: {
          description:
            "Exhibition type not found.",
        },
      },
    },
  },
};

export default exhibitionTypePaths;