import {
  createCompanyTypeExample,
  updateCompanyTypeExample,
} from "./examples.js";

const companyTypePaths = {
  //==============================
  // Create Company Type
  //==============================
  "/company-types": {
    post: {
      tags: ["Company Type"],
      summary: "Create Company Type",
      description: "Create a new company type. Admin only.",
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
              $ref: "#/components/schemas/CreateCompanyTypeRequest",
            },
            example: createCompanyTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Company type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Company type already exists.",
        },
      },
    },

    //==============================
    // Get Company Types
    //==============================
    get: {
      tags: ["Company Type"],

      summary: "Get Company Types",

      description:
        "Get paginated company types with search, sorting and pagination.",

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
          description: "Company types fetched successfully.",
        },

        401: {
          description: "Unauthorized.",
        },
      },
    },
  },

  //==============================
  // Get / Update / Delete By Id
  //==============================
  "/company-types/{id}": {
    //==============================
    // Get By Id
    //==============================
    get: {
      tags: ["Company Type"],

      summary: "Get Company Type By ID",

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
          description: "Company type fetched successfully.",
        },

        404: {
          description: "Company type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Company Type"],

      summary: "Update Company Type",

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
              $ref: "#/components/schemas/UpdateCompanyTypeRequest",
            },

            example: updateCompanyTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Company type updated successfully.",
        },

        404: {
          description: "Company type not found.",
        },

        409: {
          description: "Company type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Company Type"],

      summary: "Delete Company Type",

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
          description: "Company type deleted successfully.",
        },

        404: {
          description: "Company type not found.",
        },
      },
    },
  },
};

export default companyTypePaths;
