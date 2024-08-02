const stripe = require("stripe")(process.env.STRIPE_SECRET);

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

exports.webhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  console.log(sig);
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("event", event.data.object);
  } catch {}
  res.json("200");
};
// exports.completeOrder = async (req, res, next) => {
//   try {
//     res.status(200).json({
//       status: "success",
//       message: "Order completed successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       status: "fail",
//       message: "Cannot complete payment, try again later",
//     });
//   }
// };
