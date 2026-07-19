import multer from "multer";
import multerS3 from "multer-s3";

import s3 from "../config/s3.js";

const createUploader = (folder) => {
  return multer({
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
        const extension = file.originalname.split(".").pop();

        const fileName = `${folder}/${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}.${extension}`;

        cb(null, fileName);
      },
    }),

    limits: {
      fileSize: 5 * 1024 * 1024,
    },

    fileFilter(req, file, cb) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new Error(
            "Only JPG, JPEG and PNG images are allowed.",
          ),
        );
      }

      cb(null, true);
    },
  });
};

export default createUploader;