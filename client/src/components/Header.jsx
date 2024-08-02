import NavLogo from "../assets/NavLogo";
import { FaSearch, FaRegHeart, FaRegMoon } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoBagHandleOutline } from "react-icons/io5";
import { FiSun } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect } from "react-router-dom";
import { logout } from "../features/user/userSlice";
function Header() {
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      redirect("/");
      dispatch(logout());
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  console.log(user);
  return (
    <header className="flex pt-5 px-5 items-center justify-between md:px-16 sm:10 lg:px28 gap-3">
      <NavLogo />

      <div className="flex gap-2 self-center">
        {user && user.role === "vendor" && (
          <>
            <Link
              to={"/vendor/myProducts"}
              className="font-semibold capitalize leading-[3]"
            >
              my Products
            </Link>
          </>
        )}
        {user && user.role === "customer" && (
          <>
            <Link className="btn btn-ghost btn-circle flex">
              <IoMdNotificationsOutline className="text-2xl" />
            </Link>
            <Link
              to={"/customer/wishlist"}
              className="btn btn-ghost btn-circle flex"
            >
              <FaRegHeart className="text-2xl" />
            </Link>
            <Link
              to={"/customer/cart"}
              className="btn btn-ghost btn-circle flex relative"
            >
              <IoBagHandleOutline className="text-2xl" />
              {user && (
                <span className="text-xs absolute bg-red-700 h-4 w-4 rounded-full text-white right-1 top-2">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>
          </>
        )}
        <span className="bg-slate-500 w-[0.2px]"></span>

        <label className="swap swap-rotate text-2xl btn-circle">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            className="theme-controller"
            value="synthwave"
          />
          {/* sun icon */}
          <FiSun className="swap-off" />
          {/* moon icon */}
          <FaRegMoon className="swap-on" />
        </label>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-circle"
            style={{
              backgroundImage: `url(${
                user
                  ? user.profilePhoto
                  : "https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png"
              })`,
              backgroundSize: "cover",
            }}
          />
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-200 rounded-box z-[11] w-52 p-2 shadow right-0 mt-4"
          >
            {user ? (
              <>
                <li>
                  <Link to={"/updateProfile"}>update profile</Link>
                </li>
                <li onClick={handleSignout}>
                  <a href="">Sign out</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={"/signin"}>signin</Link>
                </li>
                <li>
                  <Link to={"/signup"}>signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
