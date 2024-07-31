const User = require("../models/User.js");
const Email = require("../utils/Email.js");
const AppError = require("../utils/AppError.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

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
    console.log(error);
    res.status(404).json({ error: error });
  }
};
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    new Email(
      newUser,
      `${req.protocol}://${req.get("host")}/home`
    ).sendWelcome();
    createSendToken(newUser, 200, res);
  } catch (error) {
    console.log(error);
    next(new AppError("error in credintial", 400));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return next(new AppError("please provide email and password"));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("incorrect credintials"));
    }
    createSendToken(user, 200, res);
  } catch (error) {
    next(new AppError("error in credintial", 400));
  }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(req.body.profilePhoto);
    const user = await User.findOne({ email });
    if (user) {
      createSendToken(user, 200, res);
    } else {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });

      new Email(
        newUser,
        `${req.protocol}://${req.get("host")}/home`
      ).sendWelcome();
      createSendToken(newUser, 200, res);
    }
  } catch (error) {
    next(new AppError("error in google auth", 404));
  }
};
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    if (!token)
      return next(new AppError("you are not logged in to access.", 401));
    // verificate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError("the user belonging to this token no longer exist", 401)
      );
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password! please log in again")
      );
    }
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError("error in jwt token", 400));
  }
};
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you don't have the permision to perform this actions.")
      );
    }
    next();
  };
