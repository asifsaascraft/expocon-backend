import {
  getAllUsersResponseExample,
  getAllStaffsResponseExample,
} from "./examples.js";

const adminUserPaths = {
  //==============================
  // Get All Users
  //==============================
  "/admin/users": {
    get: {
      tags: ["Admin Users"],

      summary: "Get All Users",

      description:
        "Get all registered users with search, pagination, sorting and status filter. Admin only.",

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

          name: "status",

          schema: {
            type: "string",
            enum: ["pending", "active", "blocked"],
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
          description: "Users fetched successfully.",

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/GetAllUsersResponse",
              },

              example: getAllUsersResponseExample,
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },
      },
    },
  },

  //==============================
  // Get All Staffs
  //==============================
  "/admin/staffs": {
    get: {
      tags: ["Admin Users"],

      summary: "Get All Staffs",

      description:
        "Get all staff members with search, pagination, sorting and status filter. Admin only.",

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

          name: "status",

          schema: {
            type: "string",
            enum: ["pending", "active", "blocked"],
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
          description: "Staffs fetched successfully.",

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/GetAllUsersResponse",
              },

              example: getAllStaffsResponseExample,
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },
      },
    },
  },
};

export default adminUserPaths;