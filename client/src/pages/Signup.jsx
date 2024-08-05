import { FaKey, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { Form, Link, redirect, useNavigation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import Cookies from "js-cookie";
import { login } from "../features/user/userSlice";
import Logo from "../assets/Logo";
const Signup = () => {
  const navigation = useNavigation();
  return (
    <section className="p-4 max-w-xl m-auto mt-5">
      <Logo />
      <h2 className="text-center font-semibold text-3xl mt-3">Signup</h2>
      <Form
        method="POST"
        className="flex flex-col justify-center mx-16 mt-5 gap-4"
      >
        <label className="input input-bordered flex items-center gap-2">
          <MdEmail />
          <input
            type="text"
            className="grow"
            placeholder="Email"
            name="email"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaUser />
          <input type="text" className="grow" placeholder="Name" name="name" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaKey />
          <input
            type="password"
            className="grow"
            name="password"
            placeholder="password"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <FaKey />
          <input
            type="password"
            className="grow"
            name="passwordConfirm"
            placeholder="confirm password"
          />
        </label>
        <select
          name="role"
          className="btn bg-slate-700 text-neutral-50 z-[1] shadow rounded-xl"
        >
          <option
            value="customer"
            className="btn  bg-[#79899d52] text-white  my-1 rounded-full min-h-10 h-10 border-none hover:bg-primary"
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
        <button
          disabled={navigation.state === "loading"}
          type="submit"
          className="btn btn-primary text-primary-content capitalize"
        >
          {navigation.state === "loading" ? (
            <>
              <span className="loading-spinner" />
              loading
            </>
          ) : (
            "signup"
          )}
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
      console.log(formDataObj);
      // Process the form data here
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
      return error?.response?.data || "null";
    }
  };
export default Signup;
