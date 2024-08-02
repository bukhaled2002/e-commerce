import { useLoaderData } from "react-router";
import customFetch from "../utils/customFetch";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../features/user/userSlice";
import { addToCart } from "../features/cart/cartSlice";
import Pagination from "./Pagination";

function Products() {
  const { user, loading } = useSelector((state) => state.user);
  const { data } = useLoaderData();
  const dispatch = useDispatch();
  const handleAddToWishlist = async (id) => {
    console.log("add");
    await customFetch.post("/product/wishlist/" + id);
    dispatch(addToWishlist(id));
  };
  const handleRemoveFromWishlist = async (id) => {
    await customFetch.delete("/product/wishlist/" + id);
    dispatch(removeFromWishlist(id));
  };

  if (loading === true) {
    return (
      <span className="loading loading-spinner loading-lg block mx-auto mt-20"></span>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-72 gap-10 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto justify-items-center mb-8">
        {data.map((item) => {
          // add ratings average
          const { name, price, description, images, avgRating } = item;
          const avgRate = Math.floor(avgRating);
          return (
            <div
              className="card bg-[#79899d3f] w-72 shadow-xl max-h-96"
              key={item.id}
            >
              <figure className="relative">
                {user && user.role === "customer" && (
                  <label className=" swap swap-rotate absolute z-3 top-3 right-6">
                    {/* this hidden checkbox controls the state */}
                    <input
                      className="hidden"
                      type="checkbox"
                      defaultChecked={user.wishList.includes(item.id)}
                    />

                    {/* close icon */}
                    <FaHeart
                      className="swap-on text-xl  text-red-600"
                      onClick={() => handleAddToWishlist(item.id)}
                    />
                    {/* hamburger icon */}
                    <FaRegHeart
                      className="swap-off  text-xl text-red-600"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    />
                  </label>
                )}
                <img
                  src={
                    images ||
                    "https://marketplace.canva.com/EAFNVAn583I/1/0/800w/canva-minimal-paper-coming-soon-instagram-post-ChSd0pJy1DQ.jpg"
                  }
                  alt={name}
                  className="w-full h-full object-contain"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  <Link to={`/product/${item.id}`}>{name}</Link>
                </h2>
                <p>{description}</p>
                <div className="rating mt-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    return (
                      <input
                        key={star}
                        value={star}
                        checked={star === avgRate}
                        readOnly={true}
                        type="radio"
                        name={`rating-${item.id}-${star}`}
                        className="mask mask-star bg-yellow-400 cursor-default foc"
                      />
                    );
                  })}
                </div>
                <div className="card-actions justify-end flex items-center mt-3">
                  <p className="text-primary">{price}$</p>
                  {user && user.role === "customer" && (
                    <button
                      className="btn btn-primary capitalize"
                      onClick={() =>
                        dispatch(
                          addToCart({
                            id: item.id,
                            title: name,
                            description,
                            price: +price,
                            quantity: 1,
                            images: images,
                          })
                        )
                      }
                    >
                      add to cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination />
    </>
  );
}

export default Products;
