const Review = require("../models/Review");

const filteringObj = (filter, filterObj) => {
  let editObj = {};
  Object.keys(filterObj).forEach((el) => {
    if (filter.includes(el)) editObj[el] = filterObj[el];
  });
  return editObj;
};

exports.getReviews = async (req, res, next) => {
  try {
    let filterObj = filteringObj(["product", "vendor", "customer"], req.body);

    const reviews = await Review.find(filterObj);
    if (!reviews) {
      return res.status(404).json({
        status: "fail",
        message: "no reviews for this product or vendor",
      });
    }

    return res.status(200).json({
      status: "success",
      result: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", message: "cannot get reviews" });
  }
};
exports.getOneReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.param.reviewId);
    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "no review found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", message: "cannot get reviews" });
  }
};
exports.setCustomer = async (req, res, next) => {
  if (!req.body.customer) req.body.customer = req.user.id;
  next();
};
exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body });
    console.log(review);
    return res.status(200).json({ status: "success", data: { review } });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", message: "cannot add reviewe", error });
  }
};
exports.editReview = async (req, res, next) => {
  try {
    const filterObj = filteringObj(["rating", "comment"], req.body);
    console.log(filterObj, req.params.reviewId, req.user.id);
    const review = await Review.findOneAndUpdate(
      {
        _id: req.params.reviewId,
        customer: req.user.id,
      },
      filterObj,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!review) {
      return res
        .status(400)
        .json({ error: "error in changing the review, try again" });
    }
    return res.status(200).json({
      status: "success",
      message: "reveiw changed successfully",
      data: { review },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", message: "cannot edit review" });
  }
};
exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findOneAndDelete({
      _id: req.params.reviewId,
      customer: req.user.id,
    });
    return res.status(200).json({
      status: "success",
      message: "reveiw deleted successfully",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", message: "cannot get reviews" });
  }
};
