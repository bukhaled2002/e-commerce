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
    let filterObj = filteringObj(["product", "vendor", "product"], req.body);
    console.log(filterObj);
    // if (vendor) {
    //   filterObj.vendor = vendor;
    // }
    // if (product) {
    //   filterObj.vendor = product;
    // }
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
exports.createReview = async (req, res, next) => {
  try {
    if (req.body.customer !== req.user.id) {
      return res.status(400).json({
        status: "fail",
        message: "not allowed to add comment for another customer",
      });
    }
    const review = await Review.create(req.body);
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
    if (req.body.customer !== req.user.id) {
      return res
        .status(400)
        .json({ status: "fail", message: "cannot change others review" });
    }
    const filterObj = filteringObj(["rating", "comment"], req.body);
    console.log(filterObj);
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    );
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
    if (req.body.customer !== req.user.id) {
      return res
        .status(400)
        .json({ status: "fail", message: "cannot delete others review" });
    }
    await Review.findByIdAndDelete(req.params.reviewId);
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
