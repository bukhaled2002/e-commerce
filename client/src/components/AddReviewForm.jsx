import { useState } from "react";
import { useSelector } from "react-redux";
import { Form, useLoaderData, useParams } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
function AddReviewForm({ setNewReviewAdded }) {
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const { productId } = useParams();
  const { vendor } = useLoaderData();
  const { user } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.post(`/review`, {
        ...review,
        product: productId,
        vendor: vendor.id,
        customer: user.id,
      });
      setReview({ rating: 5, comment: "" });
      setNewReviewAdded(true);
      toast.success("review added successfully");
    } catch (error) {
      toast.error("dont add empty review");
      console.log(error.response.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit} method="post" className="w-full">
      {/* View */}

      <h2 className="font-bold text-2xl w-full">Add Review</h2>
      <div className="rating mt-2">
        {[1, 2, 3, 4, 5].map((star) => {
          return (
            <input
              key={star}
              onClick={(e) => setReview({ ...review, rating: +e.target.value })}
              defaultChecked={star === review.rating}
              value={star}
              type="radio"
              name="rating-1"
              min={5}
              className="mask mask-star bg-yellow-400"
            />
          );
        })}
      </div>
      <textarea
        onChange={(e) => setReview({ ...review, comment: e.target.value })}
        value={review.comment}
        placeholder="add Review"
        className="textarea textarea-bordered textarea-lg max-w-l w-full min-h-32 p-2 text-sm mt-2"
      />
      <button type="submit" className="btn w-full btn-primary mt-4 ">
        add Review
      </button>
    </Form>
  );
}

export default AddReviewForm;
