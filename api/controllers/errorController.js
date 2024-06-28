const AppError = require("../utils/AppError");

const developmentError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const productionError = (res, error) => {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    console.error("Error: ", error);
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
};

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateErrorDb = (err) => {
  const value = err.errorResponse.errmsg.match(/"([^"]*)"/)[0];
  const message = `value of ${value} is duplicated, please use another value`;

  return new AppError(message, 400);
};
const handleDValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `there are error: ${errors.join(". ")}`;
  return new AppError(message, 400);
};
module.exports = (error, req, res, next) => {
  console.log(error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    developmentError(res, error);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    console.log(error);
    if (error.name === "CastError") err = handleCastErrorDb(err);
    if (error.code === 11000) err = handleDuplicateErrorDb(err);
    if (error.name === "ValidationError") err = handleDValidationErrorDb(err);
    productionError(res, err);
  }
};
