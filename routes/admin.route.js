const express = require("express");

const admin = express.Router();

// importing controllers
const {
  deleteBlog,
  deleteUser,
  userProfile,
  usersList,
} = require("../controllers/admin.controller.js");

// delete route
admin.delete("/delete/blogs/:blogId", deleteBlog);

// users list route
admin.get("/users", usersList);

// user profile route
admin.get("/user-profile/:userId", userProfile);

// delete route
admin.delete("/delete/user/:userId", deleteUser);

module.exports = admin;
