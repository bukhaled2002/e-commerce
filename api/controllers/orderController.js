const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const { cart, shippingAddress } = req.body;
    const successUrl =
      "http://localhost:3000/api/v1/order/checkout/complete?session_id={CHECKOUT_SESSION_ID}";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              description: item.description,
              images: [
                "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png",
              ],
            },
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${req.protocol}://${req.get("host")}/home`,
      customer_email: req.user.email,
      shipping_address: shippingAddress,
    });
    req.cart = {
      productsId: cart.map((item) => item.id),
      shipping: shippingAddress,
    };
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

exports.completeOrder = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Order completed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Cannot complete payment, try again later",
    });
  }
};
