import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import DeleteProductPopup from "./DeleteProductPopup";
import customFetch from "../utils/customFetch";

function ProductsTable() {
  let { data: items, result } = useLoaderData();
  const [data, setData] = useState(items);
  const [popup, setPopup] = useState(false);
  const [productId, setProductId] = useState(null);
  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      const response = await customFetch.get("/product/myProduct");
      console.log(response.data.data);
      setData(response.data.data);
    };
    fetchData();
  }, [popup]);
  if (+result < 1) {
    return <h1>No Product found</h1>;
  }

  return (
    <div className="">
      <table className="table md:max-w-screen-md m-auto">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th># Pruchaced</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {data.map((product) => {
            const { name, id, category, images } = product;
            console.log("from table", id);
            return (
              <tr key={id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          // src={productImage}
                          src={images}
                          alt={name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold capitalize">{name}</div>
                    </div>
                  </div>
                </td>
                <td>{category}</td>
                {/* get number of purchased when finish it in the backend */}
                <td>1</td>
                <td className="flex flex-col gap-2">
                  <Link
                    className="btn btn-xs bg-green-600 text-white"
                    to={`/vendor/updateProduct/${id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-xs bg-red-600 text-white"
                    onClick={() => {
                      setPopup(true);
                      setProductId(id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {popup && (
        <DeleteProductPopup setPopup={setPopup} productId={productId} />
      )}
    </div>
  );
}

export default ProductsTable;
