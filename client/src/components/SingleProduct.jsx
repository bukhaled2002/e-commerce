import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router";
import { addToCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

function SingleProduct() {
  const data = useLoaderData();
  const [amount, setAmount] = useState(1);
  const dispatch = useDispatch();
  const { name, images, description, vendor, quantity, price } = data;
  const user = useSelector((state) => state.user.user);
  const createListOfQuantity = () => {
    return Array.from({ length: quantity }, (_, i) => i + 1);
  };
  const availableQuantity = createListOfQuantity();
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: data.id,
        title: name,
        price: +price,
        quantity: +amount,
        images: images,
      })
    );
  };
  return (
    <div className="flex md:flex-row flex-col gap-10 mt-10 justify-between">
      <div className="basis-[45%] ">
        <img
          className="h-[500px] object-cover rounded-3xl"
          src={
            images ||
            "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          }
          alt={name}
        />
      </div>
      <div className="basis-[45%]">
        <h1 className="font-bold text-4xl capitalize text-primary">{name}</h1>
        <p className="mt-4 capitalize">{vendor.name}</p>
        <p className="mt-2 text-lg leading-8 text-slate-300 min-h-32 md:min-h-64">
          {description}
        </p>

        <p className="font-bold capitalize mt-4">amount</p>
        <select
          className="select max-w-xs w-full border-primary text-primary mt-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        >
          {/* <option selected>1</option> */}
          {availableQuantity.map((i) => {
            return <option key={i}>{i}</option>;
          })}
        </select>

        <p className="capitalize font-bold text-xl mt-2">price: ${price}</p>
        {/* <div className="flex justify-between mt-4 items-end"> */}
        {user ? (
          <button
            className="btn btn-primary mt-2 w-full capitalize"
            onClick={handleAddToCart}
          >
            add to cart
          </button>
        ) : (
          <Link
            className="btn btn-primary mt-2 w-full capitalize"
            to={"/signin"}
          >
            signin to continue
          </Link>
        )}
        {/* </div> */}
      </div>
    </div>
  );
}

export default SingleProduct;
