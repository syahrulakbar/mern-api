const { validationResult } = require("express-validator");
const AccountBlogs = require("../models/auth");

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const saveUser = new AccountBlogs({
    name: name,
    email: email,
    password: password,
  });
  saveUser
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Register Success",
        data: {
          name: result.name,
          email: result.email,
        },
      });
    })
    .catch((err) => console.log(err));
};

exports.getUsers = (req, res, next) => {};
