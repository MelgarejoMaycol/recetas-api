const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formatosPermitidos = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = {
  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "recetas",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          cb(error);
          return;
        }

        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      }
    );

    file.stream.pipe(uploadStream);
  },

  _removeFile(req, file, cb) {
    if (!file.filename) {
      cb(null);
      return;
    }

    cloudinary.uploader.destroy(file.filename, cb);
  },
};

const fileFilter = (req, file, cb) => {
  if (!formatosPermitidos.has(file.mimetype)) {
    cb(new Error("Formato de imagen no permitido. Usa jpg, jpeg, png o webp"));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
