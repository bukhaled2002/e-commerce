import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage, { loader as HomeLoader } from "./pages/HomePage";
import Signin, { action as signinAction } from "./pages/Signin";
import Signup, { action as signupAction } from "./pages/Signup";
import { action as updateProfileAction } from "./pages/UpdateProfilePage";
import SingleProductPage from "./pages/SingleProductPage";
import RootPage from "./pages/RootPage";
import { store } from "./store";
import { loader as SingleProductLoader } from "./pages/SingleProductPage";
import ErrorPage from "./pages/ErrorPage";
import CartPage from "./pages/CartPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import Wishlist, { loader as wishlistLoader } from "./pages/Wishlist";
import ProtectCustomerRoute from "./components/ProtectCustomerRoute";
import ProtectVendorRoute from "./components/ProtectVendorRoute";
import MyProduct, { loader as myProductLoader } from "./pages/MyProduct";
import AddNewProduct, {
  action as addProductAction,
} from "./pages/AddNewProduct";
import UpdateMyProduct, {
  action as updateProductAction,
  loader as updateLoader,
} from "./pages/UpdateMyProduct";
import Orders, { loader as orderloader } from "./pages/Orders";
// import { action as filterAction } from "./components/FilterItems";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: HomeLoader(store),
        // action: filterAction,
      },
      {
        path: "/product/:productId",
        element: <SingleProductPage />,
        loader: SingleProductLoader,
      },
      {
        path: "updateProfile",
        element: <UpdateProfilePage />,
        action: updateProfileAction(store),
      },

      {
        path: "/customer",
        element: <ProtectCustomerRoute />,
        children: [
          { path: "cart", element: <CartPage /> },
          {
            path: "wishlist",
            element: <Wishlist />,
            loader: wishlistLoader(store),
          },
          {
            path: "orders",
            element: <Orders />,
            loader: orderloader,
          },
        ],
      },
      {
        path: "/vendor",
        element: <ProtectVendorRoute />,
        children: [
          {
            path: "myProducts",
            element: <MyProduct />,
            loader: myProductLoader,
          },
          {
            path: "addProduct",
            element: <AddNewProduct />,
            action: addProductAction,
          },
          {
            path: "updateProduct/:productId",
            element: <UpdateMyProduct />,
            loader: updateLoader,
            action: updateProductAction,
          },
        ],
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
    action: signupAction(store),
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <Signin />,
    action: signinAction(store),
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
}
