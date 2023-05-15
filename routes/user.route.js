// import express module
const express = require("express");

// call Router function on express
const user = express.Router();

// import middleware
const { verifyUser } = require("../middlewares/verifyUser");

// import controllers
const {
  forgotPassword,
  login,
  postBlog,
  register,
  resetPassword,
  likeIncrement,
  commentIncrement,
  editBlogPost,
  allBlogs,
  allBlogsByUser,
  userProfile,
} = require("../controllers/user.controller.js");

// post blog
user.post("/:userId/post", verifyUser, postBlog);

// login route
user.post("/login", login);

// register route
user.post("/register", register);

// reset password
user.post("/reset-password/:email/:token", resetPassword);

// forgot password route
user.post("/forgot-password", forgotPassword);

// like on blog
user.post("/blog/:blogId/like", verifyUser, likeIncrement);

// comment on blog
user.post("/blog/:blogId/comment", verifyUser, commentIncrement);

// edit blog post
user.put("/blog/:blogId/update", verifyUser, editBlogPost);

// all the blogs
user.get("/blogs", allBlogs);

// blogs by a user
user.get("/blogs/user/:userId", allBlogsByUser);

// user.get("/id/:userId", userProfile);


// export user
module.exports = user;
