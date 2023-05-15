// importing express async handler
const expressAsyncHandler = require("express-async-handler");

// importing bcryptjs
const bcryptjs = require("bcryptjs");

// importing user model
const { User } = require("../models/user.model");
const { Blog } = require("../models/blog.model");

// importing json web token for authentication
const jwt = require("jsonwebtoken");

// importing nodemailer for sending forgot password email
const nodemailer = require("nodemailer");
const { BlogData } = require("../models/blogData.model");
// const { User } = require("../models/user.model");

// import env vairbles
require("dotenv").config();

User.Blog = User.hasMany(Blog, {
  foreignKey: "userId",
});

Blog.User = Blog.belongsTo(User, {
  foreignKey: "userId",
});

// register route
const register = expressAsyncHandler(async (req, res) => {
  // getting the data
  let { password, username } = req.body;

  // search for same username

  const findUser = await User.findOne({
    where: {
      username: username,
    },
  });

  // if username exist diplay message
  if (findUser !== null) {
    res.status(200).send({
      Msg: "Username not availabe. Choose different one!",
    });
  } else {
    // hashing password
    let hashedPassword = await bcryptjs.hash(password, 10);
    req.body.password = hashedPassword;
    // create user in db
    await User.create(req.body);
    // delete password before sending payload
    delete req.body.password;

    // send back response
    res.status(200).send({ Message: "User registered!", payload: req.body });
  }
});

// login route
const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({
    where: {
      email: email,
    },
  });

  if (findUser == null) {
    res.send({
      Msg: "User doesn't exist!",
    });
  } else {
    console.log(findUser.dataValues);
    let pass = await bcryptjs.compare(password, findUser.dataValues.password);
    if (!pass) {
      // if password not true sending response
      res.status(400).send({ Message: "Incorrect password" });
    } else {
      // signed token
      let signedToken = jwt.sign(
        {
          email: findUser.dataValues.email,
          role: findUser.dataValues.role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: 86400,
        }
      );

      // sending back response
      res.status(200).send({
        Message: "Login successful!",
        token: signedToken,
        user: findUser,
      });
    }
  }
});

// forgot password route
const forgotPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  // finding user by that email exist in db or not
  const findUser = await User.findOne({
    where: {
      email: email,
    },
  });

  // if user doesn't exist
  if (findUser === null) {
    // sending back response
    res
      .status(200)
      .send({ Message: `User with mail address ${email} doesn't exist!` });
  } else {
    // if user exist create a one time link valid for 15 mins

    const payload = {
      email: email,
    };

    // generating token from JWT
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });
    // console.log("Token generated: ", token);

    // generating link from token
    const link = `http://localhost:2121/reset-password/${findUser.email}/${token}`;
    // console.log("Link generated:", link);

    // initializing mail
    var mail = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // providing necessary details for mail
    var mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.TO_MAIL,
      subject:
        "RESET PASSWORD | Scribbler received a request to reset your password",
      text: `Hi ${email}, link for resetting your password: ${link}.\nIf you didn't request a password reset, you can ignore this email. Your password will not be changed. Thank you, Scribbler`,
    };

    // sending mail and catching error
    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error occured: " + error);
        res.status(200).send({ Message: error });
      } else {
        console.log("Email sent!", info.response);
        // sending back response
        res
          .status(200)
          .send({ Message: "Email has been sent!", link: link, token: token });
      }
    });
  }
});

// reset password route
const resetPassword = expressAsyncHandler(async (req, res) => {
  // getting email and token
  let { email, token } = req.params;
  // getting password from request body
  let { password } = req.body;

  // finding user by email if exists
  const findUser = await User.findOne({
    where: {
      email: email,
    },
  });

  try {
    // getting the original payload from jwt if token is valid
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    // checking if mail is same as db
    if (payload.email === findUser.email) {
      const hashedPassword = await bcryptjs.hash(password, 7);

      // updating password
      let updateCount = await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            email: email,
          },
        }
      );

      // sending back password reset complete response
      if (updateCount > 0) {
        res.status(200).send({ Message: "Password reset complete!" });
      }
    } else {
      // sending password not reset message
      res.status(200).send({ Message: "Password not reset!" });
    }
  } catch (error) {
    console.log("Error in reset password: ", error.message);
  }
});

// post blog
const postBlog = expressAsyncHandler(async (req, res) => {
  // get user id from paramters
  const userId = req.params.userId;
  // add userId to req body
  req.body.userId = userId;
  
  await Blog.create(req.body);
  res.status(201).send({
    Msg: `Blog posted!`,
    payload: req.body,
  });
});

// like post

const likeIncrement = expressAsyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const findBlog = await BlogData.findOne({
    where: {
      blogId: blogId,
    },
  });

  if (findBlog !== null) {
    const incrementLikeCount = await findBlog.increment("likeCount");
    res.status(200).send({
      Msg: "Liked blog post!",
    });
  } else {
    res.status(400).send({
      Msg: `Blog with ID: ${blogId} doesn't exist!`,
    });
  }
});

// increment comment
const commentIncrement = expressAsyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const findBlog = await BlogData.findOne({
    where: {
      blogId: blogId,
    },
  });

  if (findBlog !== null) {
    const incrementCommentCount = await findBlog.increment("commentCount");
    res.status(200).send({
      Msg: "Commented on blog post!",
    });
  } else {
    res.status(400).send({
      Msg: `Blog with ID: ${blogId} doesn't exist!`,
    });
  }
});

// edit blog post
const editBlogPost = expressAsyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const updateCount = await Blog.update(req.body, {
    where: {
      blogId: blogId,
    },
  });

  if (updateCount > 0) {
    res.status(200).send({
      Msg: `Blog with ID: ${blogId} updated!`,
    });
  } else {
    res.status(400).send({
      Msg: `No blog with ID: ${blogId}`,
    });
  }
});

// list of all the blogs
const allBlogs = expressAsyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ["username"],
    },
  });

  if (blogs.length > 0) {
    res.status(200).send({
      Msg: "All blogs!",
      payload: blogs,
    });
  } else {
    res.status(400).send({
      Msg: "No blogs exist!",
    });
  }
});

// ALL BLOGS BY A USER
const allBlogsByUser = expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const blogs = await Blog.findAll({
    where: {
      userId: userId,
    },
  });

  if (blogs.length > 0) {
    res.status(200).send({
      Msg: `All blogs by user ${userId}`,
      payload: blogs,
    });
  } else {
    res.status(400).send({
      Msg: `No blogs by user ${userId}`,
    });
  }
});

// const userProfile = expressAsyncHandler(async (req, res) => {
//   const userId = req.params.userId;

//   const res = await User.findOne({
//     where: {
//       userId: userId,
//     },
//   });

//   if (res === null) {
//     res.status(400).send({
//       Msg: `No user with ID: ${userId} exist!`,
//     });
//   } else {
//     res.status(200).send({
//       Msg: `User data`,
//       payload: res,
//     });
//   }
// });

// export controllers
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  postBlog,
  likeIncrement,
  commentIncrement,
  editBlogPost,
  allBlogs,
  allBlogsByUser,
  // userProfile
};
