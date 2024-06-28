const User = require("../models/User");

exports.getAllVendors = async (req, res, next) => {
  const vendors = await User.find({ role: "vendor" });
  res.json({ status: "success", results: vendors.length, data: vendors });
};
exports.getOneVendor = async (req, res, next) => {
  const vendor = await User.find({ role: "vendor", _id: req.params.vendorId });
  res.json({ status: "success", data: vendor });
};
exports.deleteVendor = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.vendorId);
  res.status(200).json({ status: "deleted successfully" });
};
exports.getAllCustomers = async (req, res, next) => {
  const customer = await User.find({ role: "customer" });
  res.json({ status: "success", results: customer.length, data: customer });
};
exports.getOneCustomer = async (req, res, next) => {
  const customer = await User.find({
    role: "customer",
    _id: req.params.customerId,
  });
  res.json({ status: "success", data: customer });
};
exports.deleteCustomer = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.customerId);
  res.status(200).json({ status: "deleted successfully" });
};
exports.getCustomersOfVendor = async () => {};
