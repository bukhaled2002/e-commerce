import { Link, redirect } from "react-router-dom";
import ProductsTable from "../components/ProductsTable";
import customFetch from "../utils/customFetch";
export const loader = async () => {
  try {
    const response = await customFetch.get("/product/myProduct");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return redirect("/");
  }
};
function MyProduct() {
  return (
    <>
      <section className="mt-10 my-25 flex justify-between m-auto max-w-screen-sm sm:max-w-screen-md">
        <h1 className="font-bold text-3xl">My Products</h1>
        <Link className="btn btn-md btn-primary" to={"/vendor/addProduct"}>
          Add Product
        </Link>
      </section>
      <span className="h-[0.5px] block bg-base-300 m-8"></span>
      <ProductsTable />
    </>
  );
}

export default MyProduct;
