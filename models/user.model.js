// importing sequelize
const sequelize = require("../database/db.config");

// importing datatypes
const { DataTypes } = require("sequelize");

const { Blog } = require("../models/blog.model");

// exporting user model
exports.User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        contains: {
          args: "@scribbler.com",
          msg: "Domain must be scribber.com only!",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "user",
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
        exclude: ["deletedAt", "updatedAt", "createdAt"],
      },
    },
  }
);
