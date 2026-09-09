import api from "../lib/axios";

export const getMovies = (type) =>
  api.get("/movies", { params: type ? { type } : {} });
export const getAllMoviesAdmin = () => api.get("/movies/admin");
export const createMovie = (data) => api.post("/movies", data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);
export const toggleMovieActive = (id) => api.patch(`/movies/${id}/toggle`);