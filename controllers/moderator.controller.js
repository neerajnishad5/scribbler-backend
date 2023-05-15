// importing express async handler
const expressAsyncHandler = require("express-async-handler");

 

// importing user model
const { User } = require("../models/user.model");

// importing nodemailer for sending forgot password email
const nodemailer = require("nodemailer");
const { Blog } = require("../models/blog.model");

User.Blog = User.hasMany(Blog, {
  foreignKey: "userId",
});

// import env vairbles
require("dotenv").config();

// delete blog
const raiseFlag = expressAsyncHandler(async (req, res) => {
  const blogId = req.params.blogId;
  const { flag } = req.body;

  const findBlog = await Blog.findOne({
    where: {
      blogId: blogId,
    },
  });

  // if blog not found
  if (findBlog === null) {
    res.status(400).send({
      Msg: `Blog with ${blogId} doesn't exist!`,
    });
  } else {
    await Blog.update(
      {
        flag: flag,
      },
      {
        where: {
          blogId: blogId,
        },
      }
    );
    res.status(200).send({
      Msg: `Flag raised for blog with ID: ${blogId}!`,
    });
  }
});

// all blogs by a user
const allBlogs = expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  const blogs = await Blog.findAll({
    where: {
      userId: userId,
    },
    attributes: {
      exclude: ["userId"],
    },
  });

  // if blogs exist
  if (blogs.length > 0) {
    res.status(200).send({
      Msg: `All blogs by user with userId: ${userId}`,
      payload: blogs,
    });
  } else {
    // if no blogs exist
    res.status(400).send({
      Msg: `No blogs by user with userId: ${userId}`,
    });
  }
});

// export all controllers
module.exports = {
  raiseFlag,
  allBlogs,
};
