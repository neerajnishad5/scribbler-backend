const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// exporting moderator middleware
exports.verifyModerator = expressAsyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (bearerToken !== null || bearerToken !== undefined) {
    const token = bearerToken.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      if (decodedToken.role === "moderator") {
        next();
      } else {
        // unauthorize access
        res.status(401).send({
          Msg: "Unauthorized access!",
        });
      }
    } catch (error) {
      res.status(440).send({
        Msg: "Session expired! Login again.",
      });
    }
  }
});
