import { useMutation, useQuery } from '@tanstack/react-query';
import { HiSparkles } from 'react-icons/hi2';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import StarRating from './StarRating';
import {
   reviewsApi,
   type GetReviewResponse,
   type summarizeResponse,
} from './reviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<summarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const reviewsQuery = useQuery<GetReviewResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   if (reviewsQuery.isLoading) {
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

   if (reviewsQuery.isError) {
      return (
         <p className="text-red-500">Could not fetch reviews. Try again!</p>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data?.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5 ">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Sumarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}

                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        Could not summarize reviews. Try again!{' '}
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
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
