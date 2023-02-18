const express = require("express");
const { body } = require("express-validator");
const routes = express.Router();
const blogController = require("../controllers/blog");

routes.post(
  "/post",

  [body("title").isLength({ min: 5 }).withMessage("input title at least 5 characters"), body("body").isLength({ min: 5 }).withMessage("input body at least 5 characters")],
  blogController.createBlogPost
);

routes.get("/posts", blogController.getAllBlogPosts);
routes.get("/post/:postId", blogController.getBlogPostById);
routes.put("/post/:postId", [body("title").isLength({ min: 5 }).withMessage("Input title at least 5 characters"), body("body").isLength({ min: 5 }).withMessage("Input body at least 5 characters")], blogController.updateBlogPost);
routes.delete("/post/:postId", blogController.deleteBlogPost);
module.exports = routes;
