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

      description: "Create a new advertisement location. Admin only.",

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
              $ref: "#/components/schemas/CreateAdvertisementLocationRequest",
            },

            example: createAdvertisementLocationExample,
          },
        },
      },

      responses: {
        201: {
          description: "Advertisement location created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Advertisement location already exists.",
        },
      },
    },

    //==============================
    // Get Advertisement Locations
    //==============================
    get: {
      tags: ["Advertisement Location"],

      summary: "Get Advertisement Locations",

      description: "Get all advertisement locations with search and sorting.",

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

          description: "Search advertisement locations by location name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "advertisementLocationName",
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
          description: "Advertisement locations fetched successfully.",

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
                    example: "Advertisement Locations fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/AdvertisementLocation",
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
          description: "Advertisement location fetched successfully.",
        },

        404: {
          description: "Advertisement location not found.",
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
              $ref: "#/components/schemas/UpdateAdvertisementLocationRequest",
            },

            example: updateAdvertisementLocationExample,
          },
        },
      },

      responses: {
        200: {
          description: "Advertisement location updated successfully.",
        },

        404: {
          description: "Advertisement location not found.",
        },

        409: {
          description: "Advertisement location already exists.",
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
          description: "Advertisement location deleted successfully.",
        },

        404: {
          description: "Advertisement location not found.",
        },
      },
    },
  },
};

export default advertisementLocationPaths;
