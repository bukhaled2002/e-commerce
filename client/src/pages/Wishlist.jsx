import Products from "../components/Products";
import customFetch from "../utils/customFetch";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setIsLoadingtoFalse,
  setIsLoadingtoTrue,
} from "../features/user/userSlice";
export const loader = (store) => async () => {
  try {
    store.dispatch(setIsLoadingtoTrue());
    const response = await customFetch.get("/product/wishlist");
    console.log(response);
    store.dispatch(setIsLoadingtoFalse());
    return response.data;
  } catch (error) {
    console.log(error);
    // return redirect("/");
  }
};

function Wishlist() {
  const { user } = useSelector((state) => state.user);
  if (!user) {
    return (
      <>
        <h1 className="font-bold text-3xl mx-8 md:max-w-screen-lg sm:m-auto">
          sign to continue
        </h1>
        <Link to={"/signin"} className="btn btn-primary ">
          signin
        </Link>
      </>
    );
  }
  return (
    <section className="mt-10 my-25">
      <h1 className="font-bold text-3xl mx-8 md:max-w-screen-md lg:max-w-screen-lg md:m-auto">
        Products
      </h1>
      <span className="h-[0.5px] block bg-base-300 m-8"></span>
      <Products />
    </section>
  );
}

export default Wishlist;
