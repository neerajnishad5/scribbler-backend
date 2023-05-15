const sequelize  = require("../database/db.config");
const { DataTypes } = require("sequelize");

// import blog model
const { Blog } = require("../models/blog.model");

// export blogData model
exports.BlogData = sequelize.define(
  "blogData",
  {
    id: {
      type: DataTypes.INTEGER,
      references: {
        model: Blog,
        key: "blogId",
      },
      primaryKey: true
    },
    likeCount: { 
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shareCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
