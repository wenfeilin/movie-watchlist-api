import { z } from "zod";

// for the POST route for watchlist routes
const addToWatchlistSchema = z.object({
  movieId: z.string().uuid(),
  status: z.enum([
    "PLANNED",
    "WATCHING",
    "COMPLETED",
    "DROPPED"
  ], {
    error: () => ({
      message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED"
    })
  }).optional(), // this is an error obj u can return to provide error message if status fails to be one of these values (obj with error containing fxn that returns obj); status is optional
  rating: z.coerce.number().int("Rating must be an integer").min(1, "Rating must be between 1 and 10").max(10, "Rating must be between 1 and 10").optional(), // this allows for both "8" and 8 (int); error message in parens, min-max range, optional 
  notes: z.string().optional()
});

export { addToWatchlistSchema };