import express from "express";
import {
  createMovie, getMovies, getAllMoviesAdmin, getMovie,
  updateMovie, deleteMovie, toggleMovieActive,
} from "../controllers/movie.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", getMovies);                    // public
router.get("/admin", protectRoute, getAllMoviesAdmin);
router.get("/:id", getMovie);                  // public
router.post("/", protectRoute, createMovie);
router.put("/:id", protectRoute, updateMovie);
router.delete("/:id", protectRoute, deleteMovie);
router.patch("/:id/toggle", protectRoute, toggleMovieActive);

export default router;