import { Form, Link, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import Logo from "../assets/Logo";
import Cookies from "js-cookie";
import { login } from "../features/user/userSlice";
import GoogleAuth from "../components/GoogleAuth";
const Signin = () => {
  return (
    <section className="p-4 max-w-xl m-auto ">
      <Logo />
      <h2 className="text-center font-semibold text-3xl dark:text-white text-neutral-800 mt-3">
        Signin
      </h2>
      <Form
        method="POST"
        className="flex flex-col justify-center mx-16 mt-5 gap-4"
      >
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
          {/* <input type="file" ref={ref} />
          <button onClick={handlePhoto}> ss</button> */}
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
        <p className="ml-1">
          dont have acount?
          <Link to={"/signup"} className="text-purple-500 ml-2">
            signup
          </Link>
        </p>

        <button
          type="submit"
          className="bg-purple-600 text-white h-10 rounded-lg"
        >
          signin
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
      console.log(error);
      return error?.response?.data || null;
    }
  };
export default Signin;
