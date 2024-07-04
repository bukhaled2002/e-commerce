const { Router } = require("express");
const {
  getReviews,
  createReview,
  deleteReview,
  getOneReview,
  editReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");
const router = Router({ mergeParams: true });
router
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("customer"), createReview);
router
  .route("/:reviewId")
  .get(getOneReview)
  .patch(protect, restrictTo("customer"), editReview)
  .delete(protect, restrictTo("customer"), deleteReview);
module.exports = router;
