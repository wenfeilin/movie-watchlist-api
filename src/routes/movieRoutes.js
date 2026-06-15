import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createMovieSchema } from "../validators/movieValidators.js";

const router = express.Router();

// Apply/use middleware so will run before route handlers for all routes/endpts of this router
router.use(authMiddleware);

router.get("/", getMovies);

router.post("/", validateRequest(createMovieSchema), addMovie);

router.put("/:id", updateMovie);

router.delete("/:id", deleteMovie);

export default router;
