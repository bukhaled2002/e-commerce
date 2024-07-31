import customFetch from "../utils/customFetch";

import Products from "../components/Products";
import Title from "../components/Title";

export const loader = async ({ request }) => {
  try {
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
    console.log(url.search);
    const response = await customFetch.get("/product" + url.search.toString());
    console.log(response.data);
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
