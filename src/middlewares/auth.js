const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = "DEV@TINDER$123";

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the cookies
    console.log("req.cookies: ", req.cookies);
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }
    //Validate the token
    const decodedObj = jwt.verify(token, SECRET_KEY);

    const { userId } = decodedObj;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
