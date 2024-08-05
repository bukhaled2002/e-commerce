import { IoMdCloudUpload } from "react-icons/io";

import { Form, redirect, useLoaderData } from "react-router-dom";
import { uploadImage } from "../utils/uploadImage";
import { useEffect, useRef, useState } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ params }) => {
  const response = await customFetch(`/product/${params.productId}`);
  return response.data.data;
};
function UpdateMyProduct() {
  const product = useLoaderData();
  const [tags, setTags] = useState(product.tags);
  const ref = useRef(null);

  const [image, setImage] = useState(product.images);
  const handleImageUpload = async (images, type) => {
    try {
      const downloadURL = await uploadImage(images, type);
      console.log(downloadURL);
      if (downloadURL !== "") {
        setImage(downloadURL); // Log the download URL
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleTags = (e) => {
    const value = e.target.value.split(" ");
    setTags(value);
    console.log(value);
  };
  return (
    <main className="mt-8">
      <section className="mx-4 max-w-screen-sm md:max-w-screen-md md:m-auto">
        <h4 className="capitalize font-semibold text-xl md:text-2xl">
          Edit Product
        </h4>
      </section>

      <span className="h-[0.5px] block bg-base-300 m-8"></span>
      <Form
        id="ss"
        className="grid grid-cols-1 md:grid-cols-2 mt-8 sm:mt-6 md:mt-12 gap-4 mx-4 max-w-screen-md sm:m-auto lg:max-w-screen-lg grid-rows-8"
        method="POST"
      >
        <div className="flex items-center justify-center w-full row-span-7">
          {image ? (
            <div>
              <img
                src={image}
                alt={image}
                className="rounded-lg h-full"
                onClick={() => ref.current.click()}
              />
              <input
                id="dropzone-file"
                type="file"
                ref={ref}
                name="reference1"
                accept="image/*"
                onChange={async (e) =>
                  await handleImageUpload(e.target.files[0], "productPhoto")
                }
              />
            </div>
          ) : (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 h-full"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                <IoMdCloudUpload />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                name="reference2"
                accept="image/*"
                onChange={async (e) =>
                  await handleImageUpload(e.target.files[0], "productPhoto")
                }
              />
            </label>
          )}
          <input type="text" name="images" value={image} hidden />
        </div>
        <label className="input input-bordered flex items-center gap-2">
          Name
          <input
            type="text"
            className="grow"
            name="name"
            minLength={8}
            defaultValue={product.name}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Description
          <input
            type="text"
            className="grow"
            name="description"
            minLength={15}
            defaultValue={product.description}
          />
        </label>
        <select
          name="category"
          className="select select-bordered w-full input flex items-center gap-2"
        >
          {["clothes", "smartphones", "accessories", "goods"].map(
            (category) => {
              return (
                <option
                  key={category}
                  value={category}
                  selected={category === product.category}
                >
                  {category}
                </option>
              );
            }
          )}
        </select>

        <label className="input input-bordered flex items-center gap-2">
          Tag
          <input
            type="text"
            className="grow"
            name="tags"
            onChange={handleTags}
            defaultValue={tags}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Price
          <input
            type="text"
            className="grow"
            name="price"
            defaultValue={product.price}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Quanitity
          <input
            type="text"
            className="grow"
            name="quantity"
            defaultValue={product.quantity}
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">free shipping</span>
          <input
            type="checkbox"
            name="freeShipping"
            className="checkbox"
            defaultChecked={product.freeShipping}
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary capitalize text-slate-50 col-start-1  sm:col-start-2"
        >
          Update
        </button>
      </Form>
    </main>
  );
}
export const action = async ({ request, params }) => {
  try {
    const formData = await request.formData();
    const formDataObj = Object.fromEntries(formData);
    console.log("form image", formDataObj.images);
    const { reference1, reference2, ...rest } = formDataObj;
    rest.tags = rest.tags.split(",");
    rest.price = +rest.price;
    rest.freeShipping = rest.freeShipping === "on" ? true : false;
    await customFetch.patch(
      `product/${params.productId}`,
      JSON.stringify(rest)
    );

    toast.success("product edited successfully");
    return redirect("/vendor/myproducts");
  } catch (error) {
    console.log(error);
    toast.success("cannot edit product");
    return null;
  }
};
export default UpdateMyProduct;
