import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewResponse = {
   summary: string | null;
   reviews: Review[];
};

const ReviewList = ({ productId }: Props) => {
   const [reviewData, setReviewData] = useState<GetReviewResponse | null>(null);
   const [isLoading, setIsLoading] = useState(false);

   const fetchReviews = async () => {
      setIsLoading(true);
      const { data } = await axios.get<GetReviewResponse>(
         `/api/products/${productId}/reviews`
      );
      setReviewData(data);
      setIsLoading(false);
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <h3 className="font-semibold">{review.author}</h3>
               <div>
                  <StarRating value={review.rating} />
               </div>
               <p className="py-2">{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
