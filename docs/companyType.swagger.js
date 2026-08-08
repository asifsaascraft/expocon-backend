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

      description: "Get all company types with search and sorting.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },

          description: "Search company types by company type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "companyTypeName",
          },

          description: "Field to sort by.",
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",
            enum: ["asc", "desc"],
            example: "asc",
          },

          description: "Sorting order.",
        },
      ],

      responses: {
        200: {
          description: "Company types fetched successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Company types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/CompanyType",
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        500: {
          description: "Internal server error.",
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
