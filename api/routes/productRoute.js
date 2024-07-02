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
} = require("../controllers/productController");
const { protect } = require("../controllers/authController");

const router = Router({ mergeParams: true });
router.use(setVendor);
router.route("/").get(getAllProducts).post(createProduct);
router.route("/wishlist").get(protect, getWishlist);
router
  .route("/wishlist/:productId")
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);
router
  .route("/:productId")
  .get(getOneProduct)
  .patch(allowVendorToChangeProducts, updateProduct)
  .delete(allowVendorToChangeProducts, deleteProduct);

module.exports = router;
