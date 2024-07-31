import { FaShopware } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div
      className={`logo  m-auto w-fit flex justify-center items-center flex-col`}
    >
      <FaShopware className=" mt-10 text-purple-400 text-6xl" />
      <h1 className="text-white text-2xl font-semibold">
        Wo<span className="text-purple-400 font-bold">OSH</span>op
      </h1>
    </div>
  );
}

export default Logo;
