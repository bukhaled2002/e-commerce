const { Router } = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getOneProduct,
  setVendor,
  deleteProduct,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  setCustomer,
  resizeImage,
  uploadPhoto,
  getMyProduct,
} = require("../controllers/productController");
const { protect } = require("../controllers/authController");
const reviewRoute = require("../routes/reviewRoute");

const router = Router({ mergeParams: true });
router.route("/").get(getAllProducts).post(protect, setVendor, createProduct);
router.route("/wishlist").get(protect, setCustomer, getWishlist);

router
  .route("/wishlist/:productId")
  .post(protect, setCustomer, addToWishlist)
  .delete(protect, setCustomer, removeFromWishlist);
router.route("/myProduct").get(protect, getMyProduct);
router
  .route("/:productId")
  .get(getOneProduct)
  .patch(protect, setVendor, updateProduct)
  .delete(protect, setVendor, deleteProduct);

router.use("/:productId/review", reviewRoute);

module.exports = router;
