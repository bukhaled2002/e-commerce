import { useDispatch, useSelector } from "react-redux";
import {
  removeEntireCart,
  removeEntireItemFromCart,
} from "../features/cart/cartSlice";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router";

function CartPage() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const handleCheckout = async () => {
    try {
      const itemToBuy = {
        cart: cart.items.map((item) => {
          return {
            id: item.id,
            name: item.title,
            description: item.description,
            images: [item.images],
            price: item.price,
            quantity: item.quantity,
          };
        }),
      };

      const response = await customFetch.post(
        "/order/checkout-session",
        itemToBuy
      );
      console.log(response);
      window.location.href = response.data.session.url;
      // navigate(response.data.session.url, { replace: true });
      dispatch(removeEntireCart());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {cart.items.length < 1 ? (
        <div className="mt-16 mx-6">
          <p className="font-bold text-2xl capitalize">no items found</p>
        </div>
      ) : (
        <div className="mt-16 mx-6 ">
          <p className="font-bold text-2xl capitalize">items found</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0 md:max-w-screen-lg md:mx-auto">
            <div className="flex flex-col gap-4 mt-10 md:col-span-3">
              {/* <div className="gap-6"> */}
              {cart.items.map((item) => {
                const { id, title, totalPrice, quantity, images } = item;

                return (
                  <div
                    // className="cart grid grid-cols-4 sm:max-w-screen-sm  mx-auto gap-4 "
                    className="cart grid grid-cols-4 gap-4  "
                    key={id}
                  >
                    {/* img  */}
                    <img
                      src={
                        images ||
                        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                      }
                      className="min-w-32 w-60 h-40 object-cover col-span-1 rounded-xl"
                    />
                    {/* detail  */}
                    <div className="font-bold text-lg capitalize ml-4  mt-5">
                      {title}
                    </div>
                    {/* amount  */}
                    <div className="flex flex-col gap-2 mt-5">
                      <h5>Amount</h5>
                      <p>{quantity}</p>
                      <button
                        className="text-primary block text-start"
                        onClick={() =>
                          dispatch(removeEntireItemFromCart({ id }))
                        }
                      >
                        remove
                      </button>
                    </div>
                    {/* price  */}
                    <div className="flex font-bold mt-5">
                      <p>${totalPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="total flex flex-col gap-4 bg-base-300 p-5 rounded-2xl h-fit md:mt-10">
              {/* subtotal */}
              <div className="flex justify-between mx-2">
                <h4>Subtotal</h4>
                <h4>${cart.totalAmount}</h4>
              </div>
              {/* sipping */}
              <div className="flex justify-between mx-2">
                <h4>Shipping</h4>
                {/* <h4>${cart.shipping || 15}</h4> */}
                <h4>No shipping </h4>
              </div>
              {/* total after sipping */}
              <div className="flex justify-between mx-2">
                <h4>Total Amount</h4>
                <h4>${cart.totalAmount}</h4>
              </div>
              {/* procceed to checkout button */}
              <button className="btn btn-primary" onClick={handleCheckout}>
                procced to checkout
              </button>
            </div>
          </div>
          {/* </div> */}
        </div>
      )}
    </>
  );
}

export default CartPage;
