const Order = require("../models/Order");
const User = require("../models/User");

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
exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      res.status(200).json({
        status: "fail",
        message: "this is not the route to Change password",
      });
    }
    let filterObj = {};
    console.log(req.body);
    Object.keys(req.body).forEach((el) => {
      if (["name", "email", "location", "phoneNumber"].includes(el))
        filterObj[el] = req.body[el];
    });
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
    res.status(403).json({ status: "fail", message: "failed to update" });
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
    res.status(403).json({ status: "fail", message: "failed to get user" });
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
