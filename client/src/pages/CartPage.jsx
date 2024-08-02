import { useDispatch, useSelector } from "react-redux";
import { removeEntireItemFromCart } from "../features/cart/cartSlice";

function CartPage() {
  const cart = useSelector((state) => state.cart);
  console.log(cart);
  const dispatch = useDispatch();
  return (
    <>
      {cart.items.length < 1 ? (
        <div className="mt-16 mx-6">
          <p className="font-bold text-2xl capitalize">no items found</p>
        </div>
      ) : (
        <div className="mt-16 mx-6 ">
          <p className="font-bold text-2xl capitalize">items found</p>
          <div className="flex flex-col gap-4 mt-10">
            {/* <div className="gap-6"> */}
            {cart.items.map((item) => {
              const { id, title, totalPrice, quantity, images } = item;
              console.log(item);
              return (
                <div
                  className="cart grid grid-cols-4 sm:max-w-screen-sm md:max-w-screen-lg mx-auto gap-4 "
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
                      onClick={() => dispatch(removeEntireItemFromCart({ id }))}
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
            <div className="total flex flex-col">
              {/* total */}
              {/* sipping */}
              {/* total after sipping */}
              {/* procceed to checkout button */}
            </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
