import {
  updateProfileExample,
  changePasswordExample,
  profileResponseExample,
  uploadProfileImageSuccessExample,
  deleteProfileImageSuccessExample,
} from "./examples.js";

import {
  success200,
  badRequest400,
  unauthorized401,
  forbidden403,
  notFound404,
  conflict409,
  internalServer500,
} from "./responses.js";

const userPaths = {
  "/users/profile": {
    get: {
      tags: ["User"],

      summary: "Get My Profile",

      description: "Retrieve the authenticated user's profile information.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Profile fetched successfully.",

          content: {
            "application/json": {
              example: profileResponseExample,
            },
          },
        },

        401: unauthorized401,

        403: forbidden403,

        404: notFound404,

        500: internalServer500,
      },
    },

    put: {
      tags: ["User"],

      summary: "Update My Profile",

      description: "Update the authenticated user's profile information.",

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
              $ref: "#/components/schemas/UpdateProfileRequest",
            },

            example: updateProfileExample,
          },
        },
      },

      responses: {
        200: {
          description: "Profile updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Profile updated successfully.",

                data: profileResponseExample.data,
              },
            },
          },
        },

        400: badRequest400,

        401: unauthorized401,

        403: forbidden403,

        404: notFound404,

        409: conflict409,

        500: internalServer500,
      },
    },
  },
  "/users/profile/image": {
    patch: {
      tags: ["User"],

      summary: "Upload Profile Image",

      description: "Upload or replace the authenticated user's profile image.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UploadProfileImageRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Profile image uploaded successfully.",

          content: {
            "application/json": {
              example: uploadProfileImageSuccessExample,
            },
          },
        },

        400: badRequest400,

        401: unauthorized401,

        403: forbidden403,

        404: notFound404,

        500: internalServer500,
      },
    },

    delete: {
      tags: ["User"],

      summary: "Delete Profile Image",

      description: "Delete the authenticated user's profile image.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Profile image deleted successfully.",

          content: {
            "application/json": {
              example: deleteProfileImageSuccessExample,
            },
          },
        },

        400: badRequest400,

        401: unauthorized401,

        403: forbidden403,

        404: notFound404,

        500: internalServer500,
      },
    },
  },
  "/users/change-password": {
    patch: {
      tags: ["User"],

      summary: "Change Password",

      description:
        "Change the authenticated user's password. All active sessions will be logged out after the password is changed successfully.",

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
              $ref: "#/components/schemas/ChangePasswordRequest",
            },

            example: changePasswordExample,
          },
        },
      },

      responses: {
        200: {
          description: "Password changed successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Password changed successfully. Please login again.",

                data: null,
              },
            },
          },
        },

        400: badRequest400,

        401: unauthorized401,

        403: forbidden403,

        404: notFound404,

        500: internalServer500,
      },
    },
  },
};

export default userPaths;
