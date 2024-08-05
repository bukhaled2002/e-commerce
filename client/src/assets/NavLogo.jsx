import { FaShopware } from "react-icons/fa6";
import { Link } from "react-router-dom";

function NavLogo() {
  return (
    <Link
      to={"/"}
      className={`w-fit flex justify-center items-center gap-2 p-2`}
    >
      <FaShopware className="text-primary text-5xl" />
      <h1 className="text-2xl font-semibold hidden md:block">
        Wo<span className="text-primary font-bold">OSH</span>op
      </h1>
    </Link>
  );
}

export default NavLogo;
