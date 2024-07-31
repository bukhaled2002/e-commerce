import { IoMdCloudUpload } from "react-icons/io";

import { Form, redirect } from "react-router-dom";
import { uploadImage } from "../utils/uploadImage";
import { useRef, useState } from "react";
import customFetch from "../utils/customFetch";

function AddNewProduct() {
  const [tags, setTags] = useState([]);
  const ref = useRef(null);
  const [image, setImage] = useState("");
  const handleImageUpload = async (images, type) => {
    try {
      const downloadURL = await uploadImage(images, type);
      if (downloadURL !== "") {
        setImage(downloadURL); // Log the download URL
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  // useEffect(() => {
  //   console.log(ref.current);
  // }, [image]);
  const handleTags = (e) => {
    const value = e.target.value.split(" ");
    setTags(value);
    console.log(value);
  };
  return (
    <main className="mt-8">
      <section className="mx-4 max-w-screen-sm md:max-w-screen-md md:m-auto">
        <h4 className="capitalize font-semibold text-xl md:text-2xl">
          Create new Product
        </h4>
      </section>

      <span className="h-[0.5px] block bg-base-300 m-8"></span>
      <Form
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
                hidden
                name="reference"
                accept="image/*"
                content="edit photo"
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
                name="reference"
                accept="image/*"
                onChange={async (e) =>
                  await handleImageUpload(e.target.files[0], "productPhoto")
                }
              />
            </label>
          )}
          <input type="text" name="images" defaultValue={image} hidden />
        </div>
        <label className="input input-bordered flex items-center gap-2">
          Name
          <input type="text" className="grow" name="name" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Description
          <input type="text" className="grow" name="description" />
        </label>
        <select
          name="category"
          className="select select-bordered w-full input flex items-center gap-2"
          defaultValue="Category"
        >
          <option value="Category" disabled={true}>
            Category
          </option>
          {["clothes", "smartphones", "accessories", "goods"].map(
            (category) => {
              return (
                <option key={category} value={category}>
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
            value={tags}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Price
          <input type="text" className="grow" name="price" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Quanitity
          <input type="text" className="grow" name="quantity" />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">free shipping</span>
          <input type="checkbox" name="freeShipping" className="checkbox" />
        </label>
        <button
          type="submit"
          className="btn btn-primary capitalize text-slate-50 col-start-1  sm:col-start-2"
        >
          upload
        </button>
      </Form>
    </main>
  );
}
export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const formDataObj = Object.fromEntries(formData);
    console.log(formDataObj);
    const { reference, ...rest } = formDataObj;
    rest.tags = rest.tags.split(",");
    rest.price = +rest.price;
    rest.freeShipping = rest.freeShipping === "on" ? true : false;
    console.log(rest);
    const response = await customFetch.post("product", JSON.stringify(rest));
    console.log(response);
    return redirect("/vendor/myproducts");
  } catch (error) {
    console.log(error);
    return null;
  }
};
export default AddNewProduct;
