import { FaShopware } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div
      className={`logo  m-auto w-fit flex justify-center items-center flex-col`}
    >
      <FaShopware className=" mt-10 text-primary text-6xl" />
      <h1 className="text-2xl font-semibold">
        Wo<span className="text-primary font-bold">OSH</span>op
      </h1>
    </div>
  );
}

export default Logo;
