import { Form, Link, redirect, useNavigation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import Logo from "../assets/Logo";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import Cookies from "js-cookie";
import { login } from "../features/user/userSlice";
import GoogleAuth from "../components/GoogleAuth";
import { toast } from "react-toastify";
const Signin = () => {
  const navigation = useNavigation();
  return (
    <section className="p-4 max-w-xl m-auto mt-20">
      <Logo />
      <h2 className="text-center font-semibold text-3xl dark:text-white text-neutral-800 mt-3">
        Signin
      </h2>
      <Form
        method="POST"
        className="flex flex-col justify-center mx-16 mt-5 gap-4"
      >
        <label className="input input-bordered flex items-center gap-2">
          <MdEmail />
          <input
            type="email"
            className="grow"
            placeholder="Email"
            name="email"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <FaKey />
          <input
            type="password"
            className="grow"
            name="password"
            placeholder="Password"
          />
        </label>
        <p className="ml-1">
          dont have acount?
          <Link to={"/signup"} className="text-primary ml-2">
            signup
          </Link>
        </p>

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
            "signin"
          )}
        </button>
        <GoogleAuth />
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
        "/user/signin",
        JSON.stringify(formDataObj)
      );
      Cookies.set("jwt", response?.data?.token, {
        secure: true,
        // httpOnly: true,
      });
      store.dispatch(login(response?.data?.data?.user));
      return redirect("/");
    } catch (error) {
      toast.error('Invalid Credintials')
      return error?.response?.data || null;
    }
  };
export default Signin;
