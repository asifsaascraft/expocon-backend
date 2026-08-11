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
  // =====================================
  // Get Upcoming Conferences By Venue ID
  // =====================================

  "/public/venues/{id}/upcoming-conferences": {
    get: {
      tags: ["Public - Venue"],

      summary: "Get Upcoming Conferences By Venue ID",

      description:
        "Get the approved venue information along with all upcoming approved conferences scheduled at that venue. Conference state, company, conference type, and conference segment are populated with limited public fields.",

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

          description: "Number of conferences per page.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: ["startDate", "endDate", "conferenceName", "createdAt"],

            default: "startDate",
          },

          description: "Field used to sort conferences.",
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            default: "asc",
          },

          description: "Sort order.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description: "Upcoming conferences fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Upcoming conferences fetched successfully.",

                data: {
                  _id: "6a79a471e480fcfb0c532356",

                  venueName: "Hyderabad International Convention Centre",

                  stateId: {
                    _id: "6a75e77efcc5048229d4673f",

                    state: "Telangana",
                  },

                  city: "Hyderabad",

                  address:
                    "17/6, Madanayakanahalli, Bengaluru, Karnataka 562162, India",

                  website: "https://example.com",

                  mapLink:
                    '<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>',

                  uploadVenuePhoto: "https://example.com/venue.jpg",

                  featured: true,

                  phone: "+919876543210",

                  uploadVenueLayout: "https://example.com/layout.pdf",

                  status: "approved",

                  upcomingConferences: [
                    {
                      _id: "6a888888888888888888888888",

                      conferenceTypeId: {
                        _id: "6a888888888888888888888889",

                        conferenceTypeName: "Medical Conference",
                      },

                      conferenceName:
                        "45th Annual Conference of the Association of Radiation Oncologists of India - AROICON 2025",

                      conferenceShortName: "AROICON 2025",

                      startDate: "2026-08-20T00:00:00.000Z",

                      endDate: "2026-08-22T00:00:00.000Z",

                      month: "August",

                      year: "2026",

                      entryTypeId: {
                        _id: "6a888888888888888888888890",

                        entryTypeName: "Delegate",
                      },

                      city: "Bhopal",

                      stateId: {
                        _id: "6a75e77efcc5048229d4673f",

                        state: "Madhya Pradesh",
                      },

                      website: "https://example.com",

                      companyId: {
                        _id: "6a888888888888888888888888",

                        companyName: "India Trade Promotion Organization",
                      },

                      conferenceSegmentId: {
                        _id: "6a888888888888888888888891",

                        conferenceSegmentName: "Medical",
                      },

                      uploadConferenceLogo: "https://example.com/logo.png",

                      committeeMember: "Dr. XYZ",

                      frequency: "Annual",

                      aboutConference: "About the conference",

                      featured: true,

                      status: "approved",
                    },
                  ],

                  pagination: {
                    total: 1,

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
        },

        // =====================================
        // 400 Bad Request
        // =====================================

        400: {
          description: "Invalid venue ID.",
        },

        // =====================================
        // 404 Not Found
        // =====================================

        404: {
          description: "Public venue not found.",
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
  // Get Upcoming Exhibitions By Venue ID
  // =====================================

  "/public/venues/{id}/upcoming-exhibitions": {
    get: {
      tags: ["Public - Venue"],

      summary: "Get Upcoming Exhibitions By Venue ID",

      description:
        "Get the approved venue information along with all upcoming approved exhibitions scheduled at that venue. Exhibition state, company, and exhibition type are populated with limited public fields.",

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

          description: "Number of exhibitions per page.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: ["startDate", "endDate", "eventName", "createdAt"],

            default: "startDate",
          },

          description: "Field used to sort exhibitions.",
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            default: "asc",
          },

          description: "Sort order.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description: "Upcoming exhibitions fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Upcoming exhibitions fetched successfully.",

                data: {
                  _id: "6a79a471e480fcfb0c532356",

                  venueName: "Hyderabad International Convention Centre",

                  stateId: {
                    _id: "6a75e77efcc5048229d4673f",

                    state: "Telangana",
                  },

                  city: "Hyderabad",

                  address:
                    "17/6, Madanayakanahalli, Bengaluru, Karnataka 562162, India",

                  website: "https://example.com",

                  mapLink:
                    '<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>',

                  uploadVenuePhoto: "https://example.com/venue.jpg",

                  featured: true,

                  phone: "+919876543210",

                  uploadVenueLayout: "https://example.com/layout.pdf",

                  status: "approved",

                  upcomingExhibitions: [
                    {
                      _id: "6a9999999999999999999999",

                      eventTypeId: "6a1111111111111111111111",

                      eventName:
                        "International Electronics and Smart Appliances Expo",

                      eventShortName: "IESAE",

                      startDate: "2026-09-10T00:00:00.000Z",

                      endDate: "2026-09-12T00:00:00.000Z",

                      month: "September",

                      year: "2026",

                      entryTypeId: {
                        _id: "6a2222222222222222222222",

                        entryTypeName: "Trade Visitor",
                      },

                      city: "Mumbai",

                      stateId: {
                        _id: "6a75e77efcc5048229d4673f",

                        state: "Maharashtra",
                      },

                      website: "https://example.com",

                      companyId: {
                        _id: "6a9999999999999999999991",

                        companyName: "ABC Exhibitions Pvt Ltd",
                      },

                      exhibitionTypeId: {
                        _id: "6a9999999999999999999992",

                        exhibitionTypeName: "Trade Exhibition",
                      },

                      uploadEventLogo: "https://example.com/logo.png",

                      frequency: "Annual",

                      aboutExhibition: "About the exhibition",

                      exhibitorProfile: "Exhibitor information",

                      speciality: "Electronics",

                      visitorProfile: "Visitor information",

                      featured: true,
                      
                      status: "approved",
                    },
                  ],

                  pagination: {
                    total: 1,

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
        },

        // =====================================
        // 400 Bad Request
        // =====================================

        400: {
          description: "Invalid venue ID.",
        },

        // =====================================
        // 404 Not Found
        // =====================================

        404: {
          description: "Public venue not found.",
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

export default publicVenuePaths;
