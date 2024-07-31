import SingleProduct from "../components/SingleProduct";
import customFetch from "../utils/customFetch";
import Review from "../components/Review";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const loader = async ({ params }) => {
  try {
    const response = await customFetch(`/product/${params.productId}`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

function SingleProductPage() {
  const user = useSelector((state) => state.user.user);
  return (
    <main className="mx-10 sm:max-w-screen-md md:max-w-screen-lg sm:mx-15 md:m-auto h-fit">
      <div className="breadcrumbs text-lg font-semibold mt-10">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/"}>Products</Link>
          </li>
        </ul>
      </div>
      <SingleProduct />
      {user && <Review />}
    </main>
  );
}

export default SingleProductPage;
