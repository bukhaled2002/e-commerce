import React from "react";
import { FaSearch } from "react-icons/fa";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { Form, useSearchParams } from "react-router-dom";

function FilterItems({ setOpenFilterOptions }) {
  const { data } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categories = ["clothes", "smartphones", "accessories", "goods"];
  const vendors = [...new Set(data.map((item) => item.vendor.name))];
  const prices = [...new Set(data.map((item) => item.price))];
  const maxPrice = Math.max(...prices);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchParams = new URLSearchParams(formData);

    setSearchParams(searchParams);
    setOpenFilterOptions(false);
    navigate(`?${searchParams.toString()}`);
  };
  const handleReset = (event) => {
    event.preventDefault();
    setOpenFilterOptions(false);
    navigate("/");
  };
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-40 z-[3]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[500px] md:max-w-screen-md bg-base-200 flex items-center justify-center rounded-xl z-[5] py-5">
        <button
          className="absolute top-1 right-3 font-bold  cursor-pointer text-xl"
          onClick={() => {
            setOpenFilterOptions(false);
          }}
        >
          X
        </button>
        <Form
          className="grid grid-cols-2 grid-rows-5 w-full p-5 gap-2 items-center"
          onSubmit={handleSubmit}
        >
          <label className="input input-bordered flex items-center gap-2 col-span-2">
            search
            <input
              type="text"
              className="grow"
              name="name"
              defaultValue={searchParams.get("name") || ""}
            />
          </label>
          <label className="flex flex-col gap-2">
            Category
            <select
              className="select select-md select-bordered w-full max-w-xs"
              name="category"
              defaultValue={searchParams.get("category" || "all")}
            >
              <option value={"all"}>All Categories</option>
              {categories.map((category) => {
                return (
                  <option value={category} key={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Vendor
            <select
              className="select select-md select-bordered max-w-xs"
              name="vendor"
              defaultValue={searchParams.get("vendor" || "all")}
            >
              <option value={"all"}>All Vendors</option>
              {vendors.map((vendor) => {
                return (
                  <option value={vendor} key={vendor}>
                    {vendor}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex col-span-2 flex-col gap-2">
            price
            <input
              type="range"
              min={`0`}
              max={`10000`}
              defaultValue={searchParams.get("maxPrice" || `${maxPrice}`)}
              className="range range-xs"
              name="maxPrice"
            />
          </label>
          <label className="flex  gap-2">
            Free Shipping
            <input
              type="checkbox"
              name="freeShipping"
              className="checkbox"
              defaultChecked={true}
            />
          </label>

          <label className="flex flex-col gap-2">
            Sort Price
            <div className="flex gap-2">
              Asc
              <input
                type="radio"
                name="sort"
                value="price"
                className="radio radio-primary"
                defaultChecked={searchParams.get("sort") === "price" || true}
              />
              Desc
              <input
                type="radio"
                name="sort"
                value="-price"
                className="radio radio-primary"
                defaultChecked={searchParams.get("sort") === "-price"}
              />
            </div>
          </label>
          <button
            onClick={handleReset}
            className="btn btn-primary text-primary-content capitalize btn-md row-start-5"
          >
            reset
          </button>
          <button
            type="submit"
            className="btn btn-primary text-primary-content capitalize btn-md row-start-5"
            // onClick={() => setOpenFilterOptions(false)}
          >
            search
          </button>
        </Form>
      </div>
    </>
  );
}
// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const formDataObj = Object.fromEntries(formData);
//   console.log(formDataObj);
//   window.location.reload();
//   return null;
// };
export default FilterItems;
