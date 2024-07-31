import { FaShopware } from "react-icons/fa6";
import { Link } from "react-router-dom";

function NavLogo() {
  return (
    <Link
      to={"/"}
      className={`w-fit flex justify-center items-center gap-2 p-2`}
    >
      <FaShopware className="text-purple-400 text-5xl" />
      <h1 className="text-white text-2xl font-semibold hidden md:block">
        Wo<span className="text-purple-400 font-bold">OSH</span>op
      </h1>
    </Link>
  );
}

export default NavLogo;
