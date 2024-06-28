const User = require("../models/User.js");
const AppError = require("../utils/AppError.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    if (!token) {
      return next(new AppError("there is an error in token", 404));
    }
    const cookieOption = {
      expires:
        new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN) *
        24 *
        60 *
        60 *
        1000,
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
      cookieOption.secure = true;
    }
    res.cookie("jwt", token, cookieOption);
    user.password = undefined;
    res.status(statusCode).json({ status: "success", token, data: { user } });
  } catch (error) {
    next(new AppError(404, error));
  }
};
exports.signup = async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 200, res);
};

exports.signin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return next(new AppError("please provide email and password"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.correctPassword(password)) {
      return next(new AppError("incorrect credintials"));
    }
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("you are not logged in to access", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded._id);
  if (!currentUser)
    return next(
      new AppError("the user belonging to this token no longer exist", 401)
    );
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError("User recently changed password! please log in again")
    );
  req.user = currentUser;
};
