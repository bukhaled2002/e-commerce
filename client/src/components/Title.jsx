import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterItems from "./FilterItems";

function Title({ text }) {
  const [openFilterOptions, setOpenFilterOptions] = useState();
  return (
    <>
      <section className="flex justify-between mx-10 md:max-w-screen-md lg:max-w-screen-lg md:mx-auto mt-10">
        <h1 className="font-bold text-3xl inline">{text}</h1>
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setOpenFilterOptions(true)}
        >
          <FaFilter />
        </button>
        {openFilterOptions && (
          <FilterItems setOpenFilterOptions={setOpenFilterOptions} />
        )}
      </section>
    </>
  );
}

export default Title;
