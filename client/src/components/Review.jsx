import { useEffect, useState } from "react";
import AddReviewForm from "./AddReviewForm";
import { useLoaderData, useParams } from "react-router";
import customFetch from "../utils/customFetch";
import { useSelector } from "react-redux";

function Review() {
  const { productId } = useParams();
  let { reviews: data } = useLoaderData();
  let [reviews, setReviews] = useState(data);
  let [newReviewAdded, setNewReviewAdded] = useState(false);
  const { role } = useSelector((state) => state.user.user);
  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await customFetch(`/product/${productId}`);
        console.log(response.data.data.reviews);
        setReviews(response.data.data.reviews);
      } catch (error) {
        console.log(error);
      }
    };
    getReviews();
  }, [newReviewAdded, productId]);
  console.log(reviews);

  reviews = reviews.slice(0, 4);
  return (
    <div className="mt-10 flex flex-col md:flex-row gap-10 justify-normal">
      <div className="w-full">
        <h2 className="font-bold text-xl">Review</h2>
        <div className=" flex flex-col gap-5 mt-8">
          {reviews.map((review) => {
            const { comment, createdAt, customer, rating, id } = review;
            const { profilePhoto, name } = customer;
            const formattedDate = new Date(createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
            return (
              <div
                key={review.id}
                className="w-full relative min-h-16 px-3 py-6 rounded-xl bg-[rgba(0,1,2,0.25)] grid grid-cols-5 "
              >
                <div className="avatar col-span-1">
                  <div className="w-16 rounded-full ">
                    <img src={profilePhoto} />
                  </div>
                </div>
                <div className="info col-span-2">
                  <h3>{name}</h3>
                  <p>{comment}</p>
                </div>
                <div className="flex flex-col items-end gap-6 col-span-2">
                  <div className="rating mt-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      return (
                        <input
                          key={star}
                          value={star}
                          defaultChecked={star === rating}
                          onChange={(e) => e.preventDefault()}
                          type="radio"
                          name={`rating-${id}`}
                          className="mask mask-star bg-yellow-400 cursor-default foc"
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs">{formattedDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {role === "customer" && (
        <AddReviewForm setNewReviewAdded={setNewReviewAdded} />
      )}
    </div>
  );
}

export default Review;
