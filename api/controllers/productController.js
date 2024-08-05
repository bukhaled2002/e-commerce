const multer = require("multer");
const Product = require("../models/Product");
const User = require("../models/User");
const sharp = require("sharp");
const AppError = require("../utils/AppError");
// we will remove multer in deployement - we will use firebase storage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not supported image file", 400), false);
  }
};

exports.setVendor = (req, res, next) => {
  if (!req.body.vendor) req.body.vendor = req.user.id;

  next();
};
exports.setCustomer = (req, res, next) => {
  if (!req.body.customer) req.body.customer = req.user.id;
  next();
};
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      name,
      category,
      maxPrice,
      vendor,
      sort,
      page = 1,
      limit = 10,
    } = req.query;
    let filterQuery = {};
    console.log(req.query);

    if (name) {
      filterQuery.name = { $regex: name, $options: "i" };
    }
    if (category) filterQuery.category = category;
    if (maxPrice) filterQuery.price = { $lte: +maxPrice };
    if (vendor) {
      const { id } = await User.findOne({ name: vendor, role: "vendor" });
      filterQuery.vendor = id;
    }

    const query = Product.find(filterQuery);

    // Sort based on the `sort` query parameter
    if (sort) {
      const sortFields = {};
      sort.split(",").forEach((field) => {
        sort.split(",").forEach((field) => {
          if (field.startsWith("-")) {
            sortFields[field.slice(1)] = -1;
          } else {
            sortFields[field] = 1;
          }
        });
      });
      query.sort(sortFields);
    } else {
      query.sort({ createdAt: -1 });
    }

    query.skip((page - 1) * limit).limit(limit);

    const products = await query.populate({ path: "vendor", select: "name" });
    const totalCounts = await Product.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalCounts / limit);
    if (page > totalPages) {
      next(new AppError("no more Pages", 404));
    }
    res.status(200).json({
      status: "success",
      totalResults: totalCounts,
      totalPages: totalPages,
      currentPage: page,
      data: products,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot get products", 404));
  }
};

exports.getMyProduct = async (req, res, next) => {
  try {
    let products;
    if (req.user.role === "vendor") {
      products = await Product.find({ vendor: req.user.id });
    } else if (req.user.role === "customer") {
      products = await Product.find({ customer: req.user.id });
    }
    res
      .status(200)
      .json({ status: "success", results: products.length, data: products });
  } catch (error) {
    next(new AppError("fail to get the products", 404));
  }
};
exports.getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate({
        path: "reviews",
        options: {
          sort: { updatedAt: -1 },
        },
        populate: {
          path: "customer",
          model: "User",
          select: "name profilePhoto",
        },
      })
      .populate({ path: "vendor", select: "name" });

    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot find product", 404));
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
    console.log(error);
    next(new AppError("cannot add product", 404));
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const productUpdated = await Product.findOneAndUpdate(
      { _id: req.params.productId, vendor: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!productUpdated) {
      next(new AppError("cannot change product", 405));
    }
    res.status(202).json({
      status: "success",
      message: "product updated successfully",
      productUpdated,
    });
  } catch (error) {
    next(new AppError("error in updating product", 404));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.productId,
      vendor: req.body.vendor,
    });
    console.log("deleted", product);
    res.status(202).json({ message: "successfully deleted" });
  } catch (error) {
    next(new AppError("item not found", 404));
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
      data: wishList,
    });
  } catch (error) {
    next(new AppError("failed to retrieve wishlist", 400));
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const result = await User.findOne({ _id: req.user.id });
    console.log(result.wishList, req.params.productId);
    if (result.wishList.includes(req.params.productId)) {
      return res.status(400).json({
        status: "fail",
        message: "product already added to wishlist",
      });
    }

    result.wishList.push(req.params.productId);
    await result.save({ validateBeforeSave: false });
    return res.status(200).json({
      status: "success",
      message: "Wishlist added successfully",
      wishList: req.params.productId,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    next(new AppError("Failed to add to wishlist", 400));
  }
};
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const result = await User.findOne({
      _id: req.body.customer,
    });
    if (result.wishList.includes(req.params.productId)) {
      result.wishList = result.wishList.filter(
        (item) => item !== req.params.productId
      );
      result.wishList = result.wishList.filter(
        (item) => !item.equals(req.params.productId)
      );
      console.log(result.wishList.length);

      await result.save({ validateBeforeSave: false });
      return res.status(200).json({
        status: "success",
        message: "Wishlist removed successfully",
        wishList: result.wishList,
      });
    }
  } catch (error) {
    console.error(error);
    next(new AppError("Failed to remove from wishlist", 400));
  }
};
