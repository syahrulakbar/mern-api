const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth");

routes.post("/register", authController.register);
routes.get("/users", authController.getUsers);
module.exports = routes;
