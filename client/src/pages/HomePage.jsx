import customFetch from "../utils/customFetch";

import Products from "../components/Products";
import Title from "../components/Title";
import {
  setIsLoadingtoFalse,
  setIsLoadingtoTrue,
} from "../features/user/userSlice";

export const loader =
  (store) =>
  async ({ request }) => {
    try {
      store.dispatch(setIsLoadingtoTrue());
      const url = new URL(request.url);
      const queryParameters = Object.fromEntries(url.searchParams);
      if (queryParameters.vendor) {
        queryParameters.vendor =
          queryParameters.vendor === "all" ? "" : queryParameters.vendor;
      }
      if (queryParameters.category) {
        queryParameters.category =
          queryParameters.category === "all" ? "" : queryParameters.category;
      }

      url.search = new URLSearchParams(queryParameters).toString();

      const response = await customFetch.get(
        "/product" + url.search.toString()
      );
      store.dispatch(setIsLoadingtoFalse());
      return response.data;
    } catch (error) {
      console.log(error);
      return error.data;
    }
  };

const HomePage = () => {
  return (
    <>
      <Title text={"Products"} />
      <section className="mt-10 my-25">
        <span className="h-[0.5px] block bg-base-300 m-8"></span>
        <Products />
      </section>
    </>
  );
};

export default HomePage;
