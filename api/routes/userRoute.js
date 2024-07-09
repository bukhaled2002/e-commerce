const { Router } = require("express");
const {
  signup,
  protect,
  restrictTo,
  signin,
} = require("../controllers/authController");
const {
  getAllVendors,
  getOneVendor,
  deleteVendor,
  getCustomersOfVendor,
  getAllCustomers,
  getOneCustomer,
  deleteCustomer,
  updateMe,
  getMe,
  deleteMe,
  getAllUsers,
  uploadPhoto,
  resizeImage,
} = require("../controllers/userController");
const router = Router();
const productRouter = require("../routes/productRoute");
// authentication
router.post("/signup", signup);
router.post("/signin", signin);

// dashboard purpose
router.route("/updateMe").post(protect, uploadPhoto, resizeImage, updateMe);
router.route("/getMe").get(protect, getMe);
router.route("/deleteMe").delete(protect, deleteMe);
router.route("/").get(getAllUsers);

router.use("/vendor/:vendorId/product", protect, productRouter);

router.use("/vendor", protect);
router.route("/vendor").get(getAllVendors);
router.route("/vendor/:vendorId").get(getOneVendor).delete(deleteVendor);

router.use("/customer", protect);
router.use("customer/:customerId/product", productRouter);
router.route("/customer").get(getAllCustomers);
router
  .route("/customer/:customerId")
  .get(getOneCustomer)
  .delete(deleteCustomer);

//   get customers for specific vendor
router
  .route("/vendor/:vendorId/customer/:customerId")
  .get(getCustomersOfVendor);
module.exports = router;
