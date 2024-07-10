const { Router } = require("express");
const { protect } = require("../controllers/authController");
const { getCheckoutSession } = require("../controllers/orderController");
const router = Router();
router.post("/checkout-session", protect, getCheckoutSession);
module.exports = router;
