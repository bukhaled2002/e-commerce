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
} = require("../controllers/userController");
const router = Router();
// authentication
router.post("/signup", signup);
router.post("/signin", signin);

// dashboard purpose

router.use("/vendor", protect, restrictTo("admin"));

router.route("/vendor").get(getAllVendors);
router.route("/vendor/:vendorID").get(getOneVendor).delete(deleteVendor);

router.use("/customer", protect, restrictTo("admin"));

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
