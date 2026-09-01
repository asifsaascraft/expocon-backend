const publicStatePaths = {
  // =====================================
  // Get Public States With Venue Count
  // =====================================

  "/public/states/venue-count": {
    get: {
      tags: ["Public - State"],

      summary: "Get All Public States With Venue Count",

      description:
        "Get all states with the number of approved venues available in each state. States with zero approved venues are also included. Results support search, pagination, and sorting by venue count.",

      parameters: [
        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },

          description: "Page number.",
        },

        {
          in: "query",

          name: "limit",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 20,
          },

          description: "Number of states per page.",
        },

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description: "Search state by state name.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: [
              "venueCount",
              "state",
            ],

            default: "venueCount",
          },

          description:
            "Field used to sort states. Default is venueCount.",
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: [
              "asc",
              "desc",
            ],

            default: "desc",
          },

          description:
            "Sort order. By default, states with the highest number of approved venues appear first.",
        },
      ],

      responses: {
        200: {
          description:
            "Public states with venue count fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public states with venue count fetched successfully.",

                data: [
                  {
                    state: "Maharashtra",
                    venueCount: 25,
                  },

                  {
                    state: "Telangana",
                    venueCount: 18,
                  },

                  {
                    state: "Karnataka",
                    venueCount: 12,
                  },

                  {
                    state: "Uttar Pradesh",
                    venueCount: 5,
                  },

                  {
                    state: "Bihar",
                    venueCount: 0,
                  },
                ],

                pagination: {
                  total: 5,
                  page: 1,
                  limit: 20,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },

        429: {
          description: "Too many requests.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },


  // =====================================
  // Get Public States With Conference Count
  // =====================================

  "/public/states/conference-count": {
    get: {
      tags: ["Public - State"],

      summary:
        "Get All Public States With Conference Count",

      description:
        "Get all states with the number of approved conferences available in each state. States with zero approved conferences are also included. Results support search, pagination, and sorting by conference count.",

      parameters: [
        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },

          description: "Page number.",
        },

        {
          in: "query",

          name: "limit",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 20,
          },

          description: "Number of states per page.",
        },

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description: "Search state by state name.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: [
              "conferenceCount",
              "state",
            ],

            default: "conferenceCount",
          },

          description:
            "Field used to sort states. Default is conferenceCount.",
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: [
              "asc",
              "desc",
            ],

            default: "desc",
          },

          description:
            "Sort order. By default, states with the highest number of approved conferences appear first.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public states with conference count fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public states with conference count fetched successfully.",

                data: [
                  {
                    state: "Maharashtra",
                    conferenceCount: 20,
                  },

                  {
                    state: "Telangana",
                    conferenceCount: 15,
                  },

                  {
                    state: "Karnataka",
                    conferenceCount: 10,
                  },

                  {
                    state: "Uttar Pradesh",
                    conferenceCount: 4,
                  },

                  {
                    state: "Bihar",
                    conferenceCount: 0,
                  },
                ],

                pagination: {
                  total: 5,
                  page: 1,
                  limit: 20,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },

        // =====================================
        // 429 Too Many Requests
        // =====================================

        429: {
          description: "Too many requests.",
        },

        // =====================================
        // 500 Server Error
        // =====================================

        500: {
          description: "Internal server error.",
        },
      },
    },
  },


  // =====================================
  // Get Public States With Exhibition Count
  // =====================================

  "/public/states/exhibition-count": {
    get: {
      tags: ["Public - State"],

      summary:
        "Get All Public States With Exhibition Count",

      description:
        "Get all states with the number of approved exhibitions available in each state. States with zero approved exhibitions are also included. Results support search, pagination, and sorting by exhibition count.",

      parameters: [
        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },

          description: "Page number.",
        },

        {
          in: "query",

          name: "limit",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 20,
          },

          description: "Number of states per page.",
        },

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description: "Search state by state name.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: [
              "exhibitionCount",
              "state",
            ],

            default: "exhibitionCount",
          },

          description:
            "Field used to sort states. Default is exhibitionCount.",
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: [
              "asc",
              "desc",
            ],

            default: "desc",
          },

          description:
            "Sort order. By default, states with the highest number of approved exhibitions appear first.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public states with exhibition count fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public states with exhibition count fetched successfully.",

                data: [
                  {
                    state: "Maharashtra",
                    exhibitionCount: 22,
                  },

                  {
                    state: "Telangana",
                    exhibitionCount: 17,
                  },

                  {
                    state: "Karnataka",
                    exhibitionCount: 13,
                  },

                  {
                    state: "Uttar Pradesh",
                    exhibitionCount: 6,
                  },

                  {
                    state: "Bihar",
                    exhibitionCount: 0,
                  },
                ],

                pagination: {
                  total: 5,
                  page: 1,
                  limit: 20,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },

        // =====================================
        // 429 Too Many Requests
        // =====================================

        429: {
          description: "Too many requests.",
        },

        // =====================================
        // 500 Server Error
        // =====================================

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};


export default publicStatePaths;