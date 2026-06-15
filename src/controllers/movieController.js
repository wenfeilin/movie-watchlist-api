import { prisma } from "../config/db.js";

// Get movie
export const getMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();

  res.status(200).json({
    status: "success",
    data: {
      movies
    }
  });
};

// Add new movie
export const addMovie = async (req, res) => {
  const {title, overview, releaseYear, genres, runtime, posterUrl} = req.body;

  const movie = await prisma.movie.create({
    data: {
      title,
      overview,
      releaseYear,
      runtime,
      posterUrl, 
      createdBy: req.user.id,
    }
  });

  res.status(201).json({
    status: "success",
    data: {
      movie
    }
  });
};

// Update movie
export const updateMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

  // Verify that movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id}
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Ensure only the owner can update
  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({ error: "Not allowed to update this movie" });
  }

  // Build update data
  const updateData = {};

  if (title) {
    updateData.title = title;
  }

  if (overview) {
    updateData.overview = overview;
  }

  if (releaseYear) {
    updateData.releaseYear = releaseYear;
  }

  if (genres) {
    updateData.genres = genres;
  }

  if (runtime) {
    updateData.runtime = runtime;
  }

  if (posterUrl) {
    updateData.posterUrl = posterUrl;
  }

  // Update movie
  const updatedMovie = await prisma.movie.update({
    where: { id: req.params.id },
    data: updateData
  });

  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie
    }
  });
};

// Delete movie
export const deleteMovie = async (req, res) => {
  // Verify that movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id }
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Ensure only owner can delete
  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({ error: "Not allowed to delete this movie" });
  }

  await prisma.movie.delete({
    where: { id: req.params.id}
  });

  res.status(200).json({
    status: "success",
    message: "Movie has been deleted"
  });
};