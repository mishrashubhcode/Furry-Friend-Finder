const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// Set up local storage using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = "pet-img-" + Date.now() + path.extname(file.originalname);
    req.fileName = fileName;
    cb(null, fileName);
  },
});

module.exports.upload = multer({ storage: storage });
