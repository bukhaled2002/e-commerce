const { Router } = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getOneProduct,
  setVendor,
  deleteProduct,
  allowVendorToChangeProducts,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  setCustomerAndProduct,
} = require("../controllers/productController");
const { protect } = require("../controllers/authController");
const reviewRoute = require("../routes/reviewRoute");

const router = Router({ mergeParams: true });
router.route("/").get(getAllProducts).post(protect, setVendor, createProduct);
router.route("/wishlist").get(protect, getWishlist);
router
  .route("/wishlist/:productId")
  .post(protect, setCustomerAndProduct, addToWishlist)
  .delete(protect, setCustomerAndProduct, removeFromWishlist);
router
  .route("/:productId")
  .get(getOneProduct)
  .patch(protect, allowVendorToChangeProducts, updateProduct)
  .delete(protect, allowVendorToChangeProducts, deleteProduct);

router.use("/:productId/review", reviewRoute);

module.exports = router;
