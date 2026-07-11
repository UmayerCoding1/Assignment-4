import { z } from "zod";

const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().optional(),
});

export const ReviewValidations = {
  createReviewSchema,
};
