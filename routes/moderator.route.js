const express = require("express");

const moderator = express.Router();

const {
  raiseFlag,
  allBlogs,
} = require("../controllers/moderator.controller.js");

moderator.put("/raise-flag/:blogId", raiseFlag);
moderator.get("/user/:userId/blogs", allBlogs);

// exporting moderator api
module.exports = moderator;
