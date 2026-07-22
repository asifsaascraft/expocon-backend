import {
  createEntryTypeExample,
  updateEntryTypeExample,
} from "./examples.js";

const entryTypePaths = {
  //==============================
  // Create Entry Type
  //==============================
  "/entry-types": {
    post: {
      tags: ["Entry Type"],

      summary: "Create Entry Type",

      description:
        "Create a new entry type. Admin only.",

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
                "#/components/schemas/CreateEntryTypeRequest",
            },

            example: createEntryTypeExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Entry type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Entry type already exists.",
        },
      },
    },

    //==============================
    // Get Entry Types
    //==============================
    get: {
      tags: ["Entry Type"],

      summary: "Get Entry Types",

      description:
        "Get paginated entry types with search, sorting and pagination.",

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
            "Entry types fetched successfully.",
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
  "/entry-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Entry Type"],

      summary: "Get Entry Type By ID",

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
            "Entry type fetched successfully.",
        },

        404: {
          description:
            "Entry type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Entry Type"],

      summary: "Update Entry Type",

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
                "#/components/schemas/UpdateEntryTypeRequest",
            },

            example: updateEntryTypeExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Entry type updated successfully.",
        },

        404: {
          description:
            "Entry type not found.",
        },

        409: {
          description:
            "Entry type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Entry Type"],

      summary: "Delete Entry Type",

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
            "Entry type deleted successfully.",
        },

        404: {
          description:
            "Entry type not found.",
        },
      },
    },
  },
};

export default entryTypePaths;