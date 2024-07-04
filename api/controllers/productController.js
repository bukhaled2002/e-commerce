const Product = require("../models/Product");
const User = require("../models/User");

exports.setVendor = (req, res, next) => {
  if (!req.body.vendor) req.body.vendor = req.params.vendorId;

  if (req.body.vendor !== req.user?.id) {
  }
  return res
    .status(404)
    .json({ message: "not allowed to change others products" });

  next();
};
exports.allowVendorToChangeProducts = (req, res, next) => {
  if (req.user?.role === "admin") req.body.vendor = req.user?.id;
  console.log(req.body.vendor, req.user.id);
  if (req.body.vendor !== req.user?.id) {
    return res
      .status(404)
      .json({ message: "not allowed to change others products" });
  }

  next();
};
exports.setCustomerAndProduct = (req, res, next) => {
  if (!req.body.customer) req.body.customer = req.params.customerId;
  if (!req.body.product) req.body.product = req.params.productId;

  next();
};
exports.getAllProducts = async (req, res, next) => {
  try {
    if (req.params.vendorId) req.query.vendor = req.params.vendorId;
    // filtering system
    let filter = { ...req.query };
    if (req.body.vendor) {
      filter.vendor = req.body.vendor;
    }
    console.log(req.query);
    const query = Product.find(filter);

    const products = await query;
    res
      .status(200)
      .json({ status: "success", results: products.length, data: products });
  } catch (error) {
    res.status(404).json({ status: "fail", message: "cannot get products" });
  }
};
exports.getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "fail", message: "cannot find product" });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      status: "success",
      message: "product added successfully",
      product,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "fail", message: "cannot find product" });
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!productUpdated) {
      return res
        .status(405)
        .json({ status: "fail", message: "cannot change product" });
    }
    res.status(202).json({
      status: "success",
      message: "product updated successfully",
      productUpdated,
    });
  } catch (error) {
    return res.status(404).json("ssss");
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.body.product);
    res.status(202).json({ message: "successfully deleted" });
  } catch (error) {
    return res.status(404).json({ message: "item not found" });
  }
};
exports.getWishlist = async (req, res, next) => {
  try {
    if (!req.body.customer) req.body.customer = req.params.customerId;
    const { wishList } = await User.findById(req.body.customer).populate({
      path: "wishList",
    });

    console.log(wishList);
    res.status(200).json({
      status: "success",
      message: "wishList retrieved successfully",
      wishList,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "failed to retrieve wishlist",
    });
  }
};
// const setCustomer=(req,res,next)=>{

//         if (!req.params.customerId) req.params.customerId = req.user.id;
//         if (!req.params.productId) {
//           return res.status(400).json({
//             status: "fail",
//             message: "Product ID is required",
//           });
//         }
// }

exports.addToWishlist = async (req, res, next) => {
  try {
    const result = await User.updateOne(
      {
        _id: req.body.customer,
        wishList: { $not: { $in: [req.body.product] } },
      },
      { $addToSet: { wishList: req.body.product } },
      { new: true, runValidators: true }
    );
    console.log(result);
    if (result.modifiedCount === 1) {
      return res.status(200).json({
        status: "success",
        message: "Wishlist added successfully",
        wishList: req.params.productId,
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "cannot add product to wishlist",
      });
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(400).json({
      status: "fail",
      message: "Failed to add to wishlist",
      error: error.message,
    });
  }
};
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const result = await User.updateOne(
      {
        _id: req.body.customer,
        wishList: { $in: [req.body.product] },
      },
      { $pull: { wishList: req.body.product } },
      { new: true, runValidators: true }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).json({
        status: "success",
        message: "Removed from wishlist successfully",
      });
    } else if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found or product not in wishlist",
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Failed to remove from wishlist",
      });
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(400).json({
      status: "fail",
      message: "Failed to remove from wishlist",
      error: error.message,
    });
  }
};
