const publicExhibitionPaths = {
  // =====================================
  // Get All Public Exhibitions
  // =====================================

  "/public/exhibitions": {
    get: {
      tags: ["Public - Exhibition"],

      summary: "Get All Public Exhibitions",

      description:
        "Get all approved public exhibitions for the public exhibition listing. The response contains only the information required for exhibition cards, including event name, dates, logo, featured status, exhibition location, and organizer information.",

      parameters: [
        // =====================================
        // Page
        // =====================================

        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },

          description:
            "Page number.",
        },

        // =====================================
        // Limit
        // =====================================

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

          description:
            "Number of exhibitions per page.",
        },

        // =====================================
        // Search
        // =====================================

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description:
            "Search exhibitions by event name or city.",
        },

        // =====================================
        // City
        // =====================================

        {
          in: "query",

          name: "city",

          required: false,

          schema: {
            type: "string",
          },

          description:
            "Filter exhibitions by exhibition city.",
        },

        // =====================================
        // State ID
        // =====================================

        {
          in: "query",

          name: "stateId",

          required: false,

          schema: {
            type: "string",
          },

          description:
            "Filter exhibitions by exhibition state ID.",
        },

        // =====================================
        // Featured
        // =====================================

        {
          in: "query",

          name: "featured",

          required: false,

          schema: {
            type: "string",

            enum: [
              "true",
              "false",
            ],
          },

          description:
            "Filter exhibitions by featured status.",
        },

        // =====================================
        // Sort By
        // =====================================

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: [
              "startDate",
              "endDate",
              "eventName",
              "city",
              "featured",
              "createdAt",
            ],

            default: "startDate",
          },

          description:
            "Secondary sorting field. Featured exhibitions are always displayed first.",
        },

        // =====================================
        // Order
        // =====================================

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

            default: "asc",
          },

          description:
            "Sort order for the selected secondary sorting field.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public exhibitions fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public exhibitions fetched successfully.",

                data: [
                  {
                    _id:
                      "6a8c195bab4c2895dd13af8f",

                    eventName:
                      "The 8th edition Of Hyderabad International Machine Tool & Engineering Expo (HIMTEX)",

                    startDate:
                      "2024-08-15T18:30:00.000Z",

                    endDate:
                      "2024-08-17T18:30:00.000Z",

                    organizer: {
                      _id:
                        "6a7ec299b5cb346da1185024",

                      companyName:
                        "Hyderabad International Trade Expositions Ltd. (HITEX)",

                      state: {
                        _id:
                          "6a75e6defcc5048229d4673c",

                        state:
                          "Telangana",
                      },

                      city:
                        "Hyderabad",

                      address:
                        "HITEX Exhibition Center, Hyderabad",
                    },

                    city:
                      "Hyderabad",

                    state: {
                      _id:
                        "6a75e6defcc5048229d4673c",

                      state:
                        "Telangana",
                    },

                    uploadEventLogo:
                      "https://expocon-bucket.s3.eu-west-2.amazonaws.com/event-logos/1787566426683-828243633.png",

                    featured: true,
                  },

                  {
                    _id:
                      "6a8c195bab4c2895dd13af90",

                    eventName:
                      "World Food India 2025",

                    startDate:
                      "2025-10-15T18:30:00.000Z",

                    endDate:
                      "2025-10-18T18:30:00.000Z",

                    organizer: {
                      _id:
                        "6a7ec299b5cb346da1185025",

                      companyName:
                        "Ministry of Food Processing Industries",

                      state: {
                        _id:
                          "6a75e6defcc5048229d4673d",

                        state:
                          "Delhi",
                      },

                      city:
                        "New Delhi",

                      address:
                        "New Delhi, India",
                    },

                    city:
                      "New Delhi",

                    state: {
                      _id:
                        "6a75e6defcc5048229d4673d",

                      state:
                        "Delhi",
                    },

                    uploadEventLogo:
                      "https://expocon-bucket.s3.eu-west-2.amazonaws.com/event-logos/example.png",

                    featured: false,
                  },
                ],

                pagination: {
                  page: 1,

                  limit: 20,

                  total: 285,

                  totalPages: 15,

                  from: 1,

                  to: 20,

                  hasPreviousPage: false,

                  hasNextPage: true,
                },
              },
            },
          },
        },

        // =====================================
        // 400 Bad Request
        // =====================================

        400: {
          description:
            "Invalid state ID.",
        },

        // =====================================
        // 429 Too Many Requests
        // =====================================

        429: {
          description:
            "Too many requests.",
        },

        // =====================================
        // 500 Server Error
        // =====================================

        500: {
          description:
            "Internal server error.",
        },
      },
    },
  },
};

export default publicExhibitionPaths;