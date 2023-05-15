const { Sequelize } = require("sequelize");

require("dotenv").config();

// create instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

// export sequelize object instance
module.exports = sequelize;
