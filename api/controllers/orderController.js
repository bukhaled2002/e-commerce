const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Order = require("../models/Order");
const User = require("../models/User");
const AppError = require("../utils/AppError");
exports.getCheckoutSession = async (req, res, next) => {
  try {
    const { cart, shippingAddress } = req.body;
    const successUrl = "https://e-commerce-frontend-2s7i.onrender.com";
    const obj = cart.map((item) => {
      return { productid: item.id, productQuantity: item.quantity };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item) => {
        console.log(item.images);
        return {
          price_data: {
            currency: "usd",
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images || [
                "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png",
              ],
            },
          },
          quantity: item.quantity,
        };
      }),
      customer_email: req.user.id,
      mode: "payment",
      success_url: successUrl,
      cancel_url: `https://e-commerce-frontend-2s7i.onrender.com`,
      customer_email: req.user.email,
      shipping_address: shippingAddress,
      metadata: { cart: JSON.stringify(cart) },
    });
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "cannot complete payment, try again later",
    });
  }
};

const createBookingCheckout = async (session) => {
  const products = JSON.parse(session.metadata.cart).map((item) => item.id);
  const shipping_cost = session.shipping_cost || 100;
  const payment_method_type = session.payment_method_types[0] || "card";
  const shipping_address_collection =
    session.shipping_address_collection || "egypt hhaha";
  const total = session.amount_total || "card";
  const { id } = await User.findOne({ email: session.customer_email });
  const obj = {
    products,
    customer: id,
    payment: { paymentMethod: payment_method_type },
    shipped: true,
    shipping: { address: shipping_address_collection, price: shipping_cost },
    total,
  };
  console.log(obj);
  const order = await Order.create(obj);
};
exports.webhookCheckout = (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  // Check if the stripe-signature header is present
  if (!sig) {
    return res.status(400).send("Webhook Error: Stripe signature not found");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};
exports.getMyOrders = async (req, res, next) => {
  try {
    const myOrders = await Order.find({ customer: req.user.id }).populate({
      path: "products",
      select: "name images",
    });
    res.status(200).json({
      status: "success",
      message: "your orders retrieved successfully",
      orders: myOrders,
    });
    if (myOrder.length === 0) {
      next(new AppError("No previous orders found"));
    }
  } catch (error) {
    next(new AppError("cannot find your orders"));
  }
};
