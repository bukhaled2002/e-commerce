import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

function DeleteProductPopup({ setPopup, productId }) {
  const handleDelete = async () => {
    try {
      const response = await customFetch.delete(`/product/${productId}`);
      console.log(response);
      setPopup(false);
      toast.success("product deleted successfully");
    } catch (error) {
      toast.error("cannot delete product");
      console.log(error);
    }
  };

  console.log(productId);
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-[3%]"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-96 bg-slate-800 flex items-center justify-center rounded-xl">
        <button
          className="absolute top-1 right-3 font-bold text-slate-200 cursor-pointer text-xl"
          onClick={() => {
            setPopup(false);
          }}
        >
          X
        </button>
        <div className="grid grid-rows-5 h-full justify-items-end">
          <h2 className="text-lg font-semibold row-start-2">
            Are you sure you want to delete Product?
          </h2>
          <button
            className="btn btn-sm bg-red-700 row-start-5 w-fit"
            onClick={handleDelete}
          >
            delete
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteProductPopup;
