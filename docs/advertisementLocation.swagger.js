import {
  createAdvertisementLocationExample,
  updateAdvertisementLocationExample,
} from "./examples.js";

const advertisementLocationPaths = {
  //==============================
  // Create Advertisement Location
  //==============================
  "/advertisement-locations": {
    post: {
      tags: ["Advertisement Location"],

      summary: "Create Advertisement Location",

      description:
        "Create a new advertisement location. Admin only.",

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
                "#/components/schemas/CreateAdvertisementLocationRequest",
            },

            example:
              createAdvertisementLocationExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Advertisement location created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Advertisement location already exists.",
        },
      },
    },

    //==============================
    // Get Advertisement Locations
    //==============================
    get: {
      tags: ["Advertisement Location"],

      summary: "Get Advertisement Locations",

      description:
        "Get paginated advertisement locations with search, sorting and pagination.",

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
            "Advertisement locations fetched successfully.",
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
  "/advertisement-locations/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Advertisement Location"],

      summary: "Get Advertisement Location By ID",

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
            "Advertisement location fetched successfully.",
        },

        404: {
          description:
            "Advertisement location not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Advertisement Location"],

      summary: "Update Advertisement Location",

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
                "#/components/schemas/UpdateAdvertisementLocationRequest",
            },

            example:
              updateAdvertisementLocationExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Advertisement location updated successfully.",
        },

        404: {
          description:
            "Advertisement location not found.",
        },

        409: {
          description:
            "Advertisement location already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Advertisement Location"],

      summary: "Delete Advertisement Location",

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
            "Advertisement location deleted successfully.",
        },

        404: {
          description:
            "Advertisement location not found.",
        },
      },
    },
  },
};

export default advertisementLocationPaths;