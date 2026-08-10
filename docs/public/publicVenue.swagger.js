const publicVenuePaths = {
  // =====================================
  // Get All Public Venues
  // =====================================

  "/public/venues": {
    get: {
      tags: ["Public - Venue"],

      summary: "Get All Public Venues",

      description:
        "Get all approved venues for the public website. The response contains only public venue information and the total number of upcoming approved exhibitions and conferences for each venue.",

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

          description: "Number of venues per page.",
        },

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description: "Search venue name or city.",
        },

        {
          in: "query",

          name: "city",

          required: false,

          schema: {
            type: "string",
          },

          description: "Filter venues by city.",
        },

        {
          in: "query",

          name: "stateId",

          required: false,

          schema: {
            type: "string",
          },

          description: "Filter venues by state ID.",
        },

        {
          in: "query",

          name: "featured",

          required: false,

          schema: {
            type: "boolean",
          },

          description: "Filter venues by featured status.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: ["createdAt", "venueName", "city", "featured"],

            default: "createdAt",
          },
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            default: "desc",
          },
        },
      ],

      responses: {
        200: {
          description: "Public venues fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Public venues fetched successfully.",

                data: [
                  {
                    _id: "68a123456789abcdef123456",

                    venueName: "Hyderabad International Convention Centre",

                    city: "Hyderabad",

                    state: {
                      _id: "68a123456789abcdef654321",

                      // FIXED: State model field is "state"
                      state: "Telangana",
                    },

                    uploadVenuePhoto: "https://example.com/venues/hicc.jpg",

                    featured: true,

                    upcomingEvents: 123,
                  },
                ],
              },
            },
          },
        },

        400: {
          description: "Invalid state ID.",
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
  // Get Public Venue By ID
  // =====================================

  "/public/venues/{id}": {
    get: {
      tags: ["Public - Venue"],

      summary: "Get Public Venue By ID",

      description:
        "Get complete information for an approved venue, including populated state, venue information, upcoming exhibition count, upcoming conference count, total upcoming events, and approved venue contacts.",

      parameters: [
        {
          in: "path",

          name: "id",

          required: true,

          schema: {
            type: "string",
          },

          description: "Venue MongoDB ObjectId.",
        },
      ],

      responses: {
        200: {
          description: "Public venue fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Public venue fetched successfully.",

                data: {
                  _id: "6a79a471e480fcfb0c532356",

                  venueName: "Rajasthan International Center",

                  stateId: {
                    _id: "6a75e77efcc5048229d4673f",

                    state: "Rajasthan",
                  },

                  city: "Jaipur",

                  address:
                    "Rajasthan International Center Sansthan Path, Jhalana Jaipur, 302017",

                  website: "https://www.ricjaipur.org/",

                  mapLink:
                    '<iframe src="https://www.google.com/maps/embed?pb=example" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',

                  uploadVenuePhoto:
                    "https://expocon-bucket.s3.eu-west-2.amazonaws.com/venue-photos/example.jpg",

                  featured: false,

                  phone: null,

                  uploadVenueLayout: null,

                  status: "approved",

                  createdAt: "2026-08-10T10:14:09.109Z",

                  updatedAt: "2026-08-10T10:15:41.075Z",

                  __v: 0,

                  upcomingEvents: 0,

                  keyContacts: [
                    {
                      _id: "6a9999999999999999999999",

                      fullName: "Sunil Sukumaran",

                      email: "sunil@example.com",

                      mobile: "9876543210",

                      stateId: "6a75e77efcc5048229d4673f",

                      companyId: "6a8888888888888888888888",

                      venueId: "6a79a471e480fcfb0c532356",

                      associationId: "6a7777777777777777777777",

                      status: "approved",
                    },
                  ],
                },
              },
            },
          },
        },

        400: {
          description: "Invalid venue ID.",
        },

        404: {
          description: "Public venue not found.",
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
};

export default publicVenuePaths;
