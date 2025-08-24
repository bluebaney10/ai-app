import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { HiSparkles } from 'react-icons/hi2';
import StarRating from './StarRating';
import { Button } from '../ui/button';
import { useState } from 'react';
import { set } from 'react-hook-form';
import ReviewSkeleton from './ReviewSkeleton';

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

type summarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const [summary, setSummary] = useState('');
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   const [summaryError, setSummaryError] = useState('');

   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const handleSummarize = async () => {
      try {
         setIsSummaryLoading(true);
         setSummaryError('');
         const { data } = await axios.post<summarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         );
         setSummary(data.summary);
      } catch (error) {
         console.error(error);
         setSummaryError('Could not summarize reviews. Try again!');
      } finally {
         setIsSummaryLoading(false);
      }
   };

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <ReviewSkeleton key={i} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <p className="text-red-500">Could not fetch reviews. Try again!</p>
      );
   }

   if (!reviewData?.reviews.length) {
      return null;
   }

   const currentSummary = reviewData?.summary || summary;

   return (
      <div>
         <div className="mb-5 ">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
                     className="cursor-pointer"
                     disabled={isSummaryLoading}
                  >
                     <HiSparkles />
                     Sumarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}

                  {summaryError && (
                     <p className="text-red-500">{summaryError}</p>
                  )}
               </div>
            )}
         </div>
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
      </div>
   );
};

export default ReviewList;
