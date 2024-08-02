const { Router } = require("express");
const { protect } = require("../controllers/authController");
const { getCheckoutSession } = require("../controllers/orderController");
const router = Router();
router.post("/checkout-session", protect, getCheckoutSession);
// router.get("/checkout/complete", protect, completeOrder);
// router.route('/').get(order)
module.exports = router;
