// importing sequelize
const sequelize = require("../database/db.config");

// importing datatypes
const { DataTypes } = require("sequelize");

// importing User model
const { User } = require("../models/user.model");

// exporting user model
exports.Blog = sequelize.define(
  "blogs",
  {
    blogId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 100],
          msg: "Category length should be greater than 2 letters!",
        },
      },
    },
    heading: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 100],
        },
      },
    },
    blog: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [20, 5000],
          msg: "Blog length has be greater than 20 characters!",
        },
      },
    },
    flag: {
      type: DataTypes.CHAR,
      defaultValue: "g",
      validate: {
        len: {
          args: [1, 2],
          msg: "Only one character allowed!",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "userId",
      },
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    deletedAt: "deletedAt",
    paranoid: true,
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ["deletedAt", "createdAt"],
      },
    },
  }
);
