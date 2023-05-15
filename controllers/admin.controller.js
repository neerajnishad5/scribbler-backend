// importing express async handler
const expressAsyncHandler = require("express-async-handler");

// importing user model
const { User } = require("../models/user.model");

const { Blog } = require("../models/blog.model");

// import env vairbles
require("dotenv").config();

// delete blog
const deleteBlog = expressAsyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const findBlog = await Blog.findOne({
    where: {
      blogId: blogId,
    },
  });
  if (findBlog === null) {
    res.status(400).send({
      Msg: `Blog with ${blogId} doesn't exist!`,
    });
  } else {
    await Blog.destroy({
      where: {
        blogId: blogId,
      },
    });
    res.status(200).send({
      Msg: `Blog with ID: ${blogId} deleted!`,
    });
  }
});

// DELETE USER
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;

  const findUser = await User.findOne({
    where: {
      userId: userId,
    },
  });

  // if user id doesn't exist
  if (findUser === null) {
    res.status(400).send({
      Msg: `User with user ID: ${userId} not found!`,
    });
  } else {
    await User.destroy({
      where: {
        userId: userId,
      },
    });
    res.status(200).send({
      Msg: `User with user ID: ${userId} deleted for community guidelines breach!`,
    });
  }
});

// ALL THE BLOGGERS ON PLATFORM
const usersList = expressAsyncHandler(async (req, res) => {
  const findUsers = await User.findAll();
  if (findUsers != null || findUsers != undefined) {
    res.status(200).send({
      Msg: "All users!",
      payload: findUsers,
    });
  } else {
    res.status(200).send({
      Msg: "No users exist!",
    });
  }
});

// USER PROFILE OF A PARTICULAR BLOGGER
const userProfile = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  const findUser = await User.findOne({
    where: {
      userId: userId,
    },
  });

  // if user not found
  if (findUser !== null) {
    res.status(400).send({
      Msg: `User with ID: ${userId} doesn't exist!`,
    });
  } else {
    delete findUser.password;
    res.status(200).send({
      Msg: "User profile!",
      payload: findUser,
    });
  }
});

// EXPORTING CONTROLLERS
module.exports = {
  deleteBlog,
  deleteUser,
  usersList,
  userProfile,
};
