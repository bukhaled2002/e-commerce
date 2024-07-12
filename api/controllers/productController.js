const multer = require("multer");
const Product = require("../models/Product");
const User = require("../models/User");
const sharp = require("sharp");
// we will remove multer in deployement - we will use firebase storage
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

exports.uploadPhoto = upload.array("images", 6);

exports.resizeImage = async (req, res, next) => {
  if (req.files) {
    req.body.images = [];
    await Promise.all(
      req.files.map(async (file, id) => {
        const filename = `product-${req.params.productId}-${id}.jpeg`;
        req.body.images.push(filename);
        await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`api/public/img/product/${filename}`);
      })
    );
    next();
  }
  next();
};

exports.setVendor = (req, res, next) => {
  if (!req.body.vendor) req.body.vendor = req.user.id;

  next();
};
exports.setCustomer = (req, res, next) => {
  if (!req.body.customer) req.body.customer = req.params.customerId;
  next();
};
exports.getAllProducts = async (req, res, next) => {
  try {
    let filter = { ...req.query };
    const query = Product.find(filter);

    const products = await query;
    console.log(products);
    res
      .status(200)
      .json({ status: "success", results: products.length, data: products });
  } catch (error) {
    res.status(404).json({ status: "fail", message: "cannot get products" });
  }
};

exports.getMyProduct = async (req, res, next) => {
  let products;
  if (req.user.role === "vendor") {
    console.log("vendor");
    products = await Product.find({ vendor: req.user.id });
  } else if (req.user.role === "customer") {
    products = await Product.find({ customer: req.user.id });
  }
  res
    .status(200)
    .json({ status: "success", results: products.length, data: products });
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
    // const result = await User.updateOne(
    //   {
    //     _id: req.body.customer,
    //     wishList: { $not: { $in: [req.params.productId] } },
    //   },
    //   { $addToSet: { wishList: req.body.product } },
    //   { new: true, runValidators: true }
    // );
    // console.log(result);
    // if (result.modifiedCount === 1) {
    //   return res.status(200).json({
    //     status: "success",
    //     message: "Wishlist added successfully",
    //     wishList: req.params.productId,
    //   });

    const result = await User.findOne({ id: req.user.id });
    if (req.params.productId in result.wishList) {
      return res.status(400).json({
        status: "fail",
        message: "product already added to wishlist",
      });
    }

    result.wishList.push(req.params.productId);
    await result.save();
    return res.status(200).json({
      status: "success",
      message: "Wishlist added successfully",
      wishList: req.params.productId,
    });
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
