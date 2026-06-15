import express from "express";
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

// Apply/use middleware so will run before route handlers for all routes/endpts of this router
router.use(authMiddleware);

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist); // put validator middleware on this specific route instead of using on all routes b/c not all routes require validation; pass in schema specific to this route in middleware

router.put("/:id", updateWatchlistItem); // ID of watchlist item to update

router.delete("/:id", removeFromWatchlist); // ID of watchlist item to delete

// NOTE: for delete and put routes, send stuff like movie ID through the route params, not through req body (for POST, use req body tho)


export default router;