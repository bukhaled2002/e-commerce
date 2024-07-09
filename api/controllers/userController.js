const Order = require("../models/Order");
const User = require("../models/User");
const multer = require("multer");
const AppError = require("../utils/AppError");
const sharp = require("sharp");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: "success",
      message: "updated successfully",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    return res.status(200).json({
      status: "failed",
      message: "cannot get users",
    });
  }
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // console.log("req", req);
//     // console.log("file", file);
//     cb(null, "api/public/img/user");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `user-${req.user.id}-${Date.now()}.${file.mimetype.split("/")[1]}`
//     );
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not supported image file", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("profilePhoto");

exports.resizeImage = async (req, res, next) => {
  // console.log(req.file);
  try {
    if (!req.file) {
      next();
    }
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`api/public/img/user/${req.file.filename}`);
    next();
  } catch (error) {
    next();
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(200).json({
        status: "fail",
        message: "this is not the route to Change password",
      });
    }
    let filterObj = {};
    Object.keys(req.body).forEach((el) => {
      if (["name", "email", "location", "phoneNumber"].includes(el))
        filterObj[el] = req.body[el];
    });
    if (req.file) filterObj.profilePhoto = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      message: "updated successfully",
      data: { updatedUser },
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(403)
      .json({ status: "fail", message: "failed to update" });
  }
};
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "success",
      message: "retrieved successfully",
      data: { user },
    });
    res.status(200).json({
      status: "success",
      message: "deleted successfully",
      data: null,
    });
  } catch (error) {
    return res
      .status(403)
      .json({ status: "fail", message: "failed to get user" });
  }
};
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res
      .status(202)
      .json({ status: "success", message: "deleted successfully" });
  } catch (error) {
    res.status(403).json({ status: "fail", message: "failed to delete" });
  }
};
exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: "vendor" });
    res.json({ status: "success", results: vendors.length, data: vendors });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error });
  }
};
exports.getOneVendor = async (req, res, next) => {
  console.log(req.params.vendorId);
  try {
    const vendor = await User.find({
      role: "vendor",
      _id: req.params.vendorId,
    });
    console.log(vendor);
    if (vendor.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "no vendor found with this id" });
    }
    return res.json({ status: "success", data: vendor });
  } catch (error) {
    console.log(error);
    return res.json({ status: "fail", message: "error in finding vendor" });
  }
};
exports.deleteVendor = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.vendorId);
  res.status(200).json({ status: "deleted successfully" });
};
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customer = await User.find({ role: "customer" });
    return res.json({
      status: "success",
      results: customer.length,
      data: customer,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "cannot get customers",
    });
  }
};
exports.getOneCustomer = async (req, res, next) => {
  try {
    const customer = await User.find({
      role: "customer",
      _id: req.params.customerId,
    });
    if (customer.length === 0) {
      return (
        res.status(400),
        json({ status: "fail", message: "no customer found with this id" })
      );
    }
    return res.status(200).json({ status: "success", data: customer });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "fail", message: "this is not valid customer" });
  }
};
exports.deleteCustomer = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.customerId);
  res.status(200).json({ status: "deleted successfully" });
};
exports.getCustomersOfVendor = async (req, res, next) => {
  const customers = await User.find({
    _id: await Order.distinct("customer", { vendor: req.params.vendorId }),
  });

  res
    .status(200)
    .json({ status: "success", response: customers.length, data: customers });
};
