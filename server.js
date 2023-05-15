// importing express module
const express = require("express");

// calling express function
const app = express();

// calling config() on dotenv library
require("dotenv").config();
const PORT = process.env.PORT || 2121;

// importing cors library
const cors = require("cors");


app.use(cors());

// import sequelize database
const sequelize = require("./database/db.config");

// importing middlewares
const { verifyAdmin } = require("./middlewares/verifyAdmin");
const { verifyModerator } = require("./middlewares/verifyModerator");

// body parser middleware
app.use(express.json());

// checking db connection
sequelize
  .authenticate()
  .then(() => console.log("DB connection success"))
  .catch((err) => console.log(err));

// syncing all the models with db tables
sequelize.sync({});

// api routes
app.use("/admin", verifyAdmin, require("./routes/admin.route"));
app.use("/moderator", verifyModerator, require("./routes/moderator.route"));
app.use("/", require("./routes/user.route"));

// invalid path
app.use("*", (req, res) => {
  res.send({ message: "Invalid path" });
});
// error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.send({ message: err.message });
});

// listening to a port
app.listen(PORT, console.log(`Server is running @ ${PORT}`));

// exporting app
module.exports = app;
