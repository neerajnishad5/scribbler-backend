const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// export user middleware
exports.verifyUser = expressAsyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  // console.log(bearerToken);

  if (bearerToken === undefined) {
    res.status(401).send({ Msg: "Unauthorized access!" });
  } else {
    const token = bearerToken.split(" ")[1];
    // console.log(token);
    try {
      const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);

      console.log(decodedToken);

      if (decodedToken.role === "user") {
        next();
      } else {
        // unauthorize access
        res.status(401).send({
          Msg: "Unauthorized access!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(440).send({
        Msg: "Session expired! Login again.",
      });
    }
  }
});
