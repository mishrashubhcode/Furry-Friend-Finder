const express = require("express");
const { protectedRouth } = require("../lib/permissions");
const route = express.Router();
const multer = require("multer");

// Set up multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Specify the folder where you want to store the files locally
  },
  filename: function (req, file, cb) {
    const fileName = "pet-img-" + Date.now() + "." + file.originalname.split(".")[1];
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

route.post(
  "/pet",
  protectedRouth("admin"),
  upload.single("image"),
  (req, res) => {
    res.send(req.fileName);
  }
);

module.exports = route;
