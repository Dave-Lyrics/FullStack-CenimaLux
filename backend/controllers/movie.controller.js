import Movie from "../models/Movie.js";
import Showtime from "../models/Showtime.js";
import cloudinary from "../lib/cloudinary.js";

const slugify = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const createMovie = async (req, res) => {
  try {
    const {
      title, genre, duration, rating, description,
      poster, releaseType, releaseDate,
    } = req.body;
    if (!title || !genre || !duration || !description) {
      return res.status(400).json({ error: "Title, genre, duration and description are required" });
    }
    const slug = slugify(title);
    const existing = await Movie.findOne({ slug });
    if (existing) return res.status(400).json({ error: "A movie with this title already exists" });

    let posterUrl = "";
    let posterPublicId = "";
    if (poster && poster.startsWith("data:image")) {
      const uploaded = await cloudinary.uploader.upload(poster, { folder: "cinemalux/movies" });
      posterUrl = uploaded.secure_url;
      posterPublicId = uploaded.public_id;
    } else if (poster) {
      posterUrl = poster; // plain URL is also fine
    }

    const movie = await Movie.create({
      title, slug, genre, duration,
      rating: rating || "TBD",
      description, poster: posterUrl, posterPublicId,
      releaseType: releaseType || "now_showing",
      releaseDate: releaseDate || null,
    });
    res.status(201).json(movie);
  } catch (error) {
    console.log("Create Movie Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Public - ?type=now_showing|coming_soon (only active movies)
export const getMovies = async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.type) filter.releaseType = req.query.type;
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin - all movies incl. inactive
export const getAllMoviesAdmin = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const { title, genre, duration, rating, description, poster, releaseType, releaseDate } = req.body;
    if (title) {
      movie.title = title;
      movie.slug = slugify(title);
    }
    if (genre) movie.genre = genre;
    if (duration) movie.duration = duration;
    if (rating !== undefined) movie.rating = rating;
    if (description) movie.description = description;
    if (releaseType) movie.releaseType = releaseType;
    if (releaseDate !== undefined) movie.releaseDate = releaseDate;

    if (poster && poster.startsWith("data:image")) {
      if (movie.posterPublicId) {
        await cloudinary.uploader.destroy(movie.posterPublicId).catch(() => {});
      }
      const uploaded = await cloudinary.uploader.upload(poster, { folder: "cinemalux/movies" });
      movie.poster = uploaded.secure_url;
      movie.posterPublicId = uploaded.public_id;
    } else if (poster) {
      movie.poster = poster;
    }

    await movie.save();
    res.status(200).json(movie);
  } catch (error) {
    console.log("Update Movie Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const toggleMovieActive = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    movie.active = !movie.active;
    await movie.save();
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    if (movie.posterPublicId) {
      await cloudinary.uploader.destroy(movie.posterPublicId).catch(() => {});
    }
    await Showtime.deleteMany({ movie: movie._id });
    await Movie.findByIdAndDelete(movie._id);
    res.status(200).json({ message: "Movie and its showtimes deleted successfully" });
  } catch (error) {
    console.log("Delete Movie Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};