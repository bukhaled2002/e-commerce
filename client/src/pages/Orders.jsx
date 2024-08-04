import { redirect, useLoaderData } from "react-router";
import customFetch from "../utils/customFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const loader = async () => {
  try {
    const response = await customFetch.get("/order");
    console.log(response.data.orders);
    return response.data;
  } catch (error) {
    console.log(error);
    return redirect("/");
  }
};

function Orders() {
  let { orders } = useLoaderData();
  console.log(orders);
  //   const [data, setData] = useState(items);
  //   const [popup, setPopup] = useState(false);
  //   const [productId, setProductId] = useState(null);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const response = await customFetch.get("/product/myProduct");
  //       console.log(response.data.data);
  //       setData(response.data.data);
  //     };
  //     fetchData();
  //   }, [popup]);
  //   if (+result < 1) {
  //     return <h1>No Product found</h1>;
  //   }
  return (
    <div className="">
      <table className="table md:max-w-screen-md m-auto">
        {/* head */}
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Shipping Address</th>
            <th>Payment Method</th>
            <th>Shipped</th>
            <th>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {orders.map((order) => {
            const { id, shipping, total, payment, shipped } = order;
            console.log("from table", id);
            return (
              <tr key={id}>
                <td>
                  <h4>{id}</h4>
                </td>
                <td>{shipping.address}</td>
                <td>{payment.paymentMethod}</td>
                <td>{shipped ? "yes" : "no"}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* {popup && (
          <DeleteProductPopup setPopup={setPopup} productId={productId} />
        )} */}
    </div>
  );
}

export default Orders;
