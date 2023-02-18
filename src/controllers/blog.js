const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const BlogPost = require("../models/blog");

exports.createBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image must be Upload");
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  if (!errors.isEmpty()) {
    console.log("ERROR");
  }
  const image = req.file.filename;
  const body = req.body.body;

  const Posting = new BlogPost({
    title: title,
    body: body,

    image: image,
    author: {
      uid: 1,
      name: "Mochamad Syahrul Akbar",
    },
  });

  // Menyimpan ke database
  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create Blog Post Success",
        data: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAllBlogPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 4;
  const orderSort = req.query._order || "desc";
  let totalItems;
  const sortAsc = orderSort === "asc" ? { updatedAt: 1 } : { updatedAt: -1 };
  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
        .sort(sortAsc);
    })
    .then((result) => {
      res.status(200).json({
        message: "Get All Blog Success",
        data: result,
        total_data: totalItems,
        per_page: parseInt(perPage),
        current_page: parseInt(currentPage),
      });
    })
    .catch((err) => next(err));
};

exports.getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!result) {
        const err = new Error("blog post not found");
        err.errorStatus = 404;
        throw err;
      }
      res.status(200).json({
        message: "Get blog post by id Success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

exports.updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const title = req.body.title;
  const body = req.body.body;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog Post Not Found");
        err.errorStatus = 404;
        throw err;
      }

      if (req.file) {
        removeImage(post.image);
        post.image = req.file.filename;
      }
      post.title = title;
      post.body = body;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update Blog Post Success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

exports.deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog Post Not Found");
        err.errorStatus = 404;
        throw err;
      }

      removeImage(post.image);
      return BlogPost.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Delete Blog Post Success",
        data: result,
      });
    })
    .catch((err) => next(err));
};

const removeImage = (filePath) => {
  if (!filePath) {
    return console.log("OK");
  }
  filePath = path.join(__dirname, "../../images", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
