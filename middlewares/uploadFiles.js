import multer from "multer";
import multerS3 from "multer-s3";

import s3 from "../config/s3.js";

const uploadFiles = multer({
  storage: multerS3({
    s3,

    bucket: process.env.AWS_BUCKET_NAME,

    acl: "public-read",

    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata(req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
      });
    },

    key(req, file, cb) {
      let folder = "uploads";

      if (file.fieldname === "uploadVenuePhoto") {
        folder = "venue-photos";
      }

      if (file.fieldname === "uploadVenueLayout") {
        folder = "venue-layouts";
      }

      const extension = file.originalname.split(".").pop();

      const fileName = `${folder}/${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}.${extension}`;

      cb(null, fileName);
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (file.fieldname === "uploadVenuePhoto") {
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(
          new Error(
            "Venue photo must be JPG, JPEG or PNG.",
          ),
        );
      }
    }

    if (file.fieldname === "uploadVenueLayout") {
      if (file.mimetype !== "application/pdf") {
        return cb(
          new Error(
            "Venue layout must be a PDF file.",
          ),
        );
      }
    }

    cb(null, true);
  },
});

export default uploadFiles;