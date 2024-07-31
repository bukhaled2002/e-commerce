import { FaShopware } from "react-icons/fa6";
import { Form, Link, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import Cookies from "js-cookie";
import { login } from "../features/user/userSlice";
const Signup = () => {
  return (
    <section className="p-4 max-w-xl m-auto ">
      <div className="logo  m-auto w-fit flex justify-center items-center flex-col">
        <FaShopware className=" mt-10 text-purple-400 text-6xl" />
        <h1 className="text-white text-2xl font-semibold">
          Wo<span className="text-purple-400 font-bold">OSH</span>op
        </h1>
      </div>
      <h2 className="text-center font-semibold text-3xl dark:text-white text-neutral-800 mt-3">
        Signup
      </h2>
      <Form
        method="POST"
        className="flex flex-col justify-center mx-16 mt-5 gap-4"
      >
        <div className="max-w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="John doe"
          />
        </div>
        <div className="max-w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="example@gmail.com"
          />
        </div>
        <div className="max-w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="*********"
          />
        </div>
        <div className="max-w-full">
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Password Confirm
          </label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="*********"
          />
        </div>
        <select
          name="role"
          className="btn bg-slate-700 z-[1] shadow rounded-xl"
        >
          <option
            value="customer"
            className="btn bg-[#79899d52] text-white my-1 rounded-full min-h-10 h-10 border-none hover:bg-primary"
          >
            customer
          </option>
          <option
            value={"vendor"}
            className="btn bg-[#79899d52] text-white my-1 rounded-full min-h-10 h-10 border-none hover:bg-primary"
          >
            vendor
          </option>
        </select>
        <button type="submit" className="bg-primary text-white h-10 rounded-lg">
          sign up
        </button>
        <p className="ml-1">
          Already have acount?
          <Link to={"/signin"} className="text-primary ml-2">
            signin
          </Link>
        </p>
      </Form>
    </section>
  );
};
export const action =
  (store) =>
  async ({ request }) => {
    try {
      const formData = await request.formData();
      const formDataObj = Object.fromEntries(formData);
      // Process the form data here
      console.log(formDataObj);
      const response = await customFetch.post(
        "/user/signup",
        JSON.stringify(formDataObj)
      );
      Cookies.set("jwt", response?.data?.token, {
        secure: true,
        // httpOnly: true,
      });
      store.dispatch(login(response?.data?.data.user));
      // console.log(response.data.data.user);
      return redirect("/");
    } catch (error) {
      console.log(error);
      return error?.response?.data || null;
    }
  };
export default Signup;
