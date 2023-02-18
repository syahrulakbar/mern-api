const express = require("express");
const body = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

// Config Multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// type JSON
app.use(body.json());

// GET IMAGE
app.use("/images", express.static(path.join(__dirname, "images")));

// Midlewate multer
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});
// console.log(path.join(__dirname, "images/"));

mongoose
  .connect("mongodb+srv://akbar:8SoMn4k6cTZypfNB@cluster0.rezjegc.mongodb.net/blog?retryWrites=true&w=majority")
  .then(() => {
    app.listen(4000, () => console.log("Connection Success"));
  })
  .catch((err) => console.log(err));
