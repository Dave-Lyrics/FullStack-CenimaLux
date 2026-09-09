import api from "../lib/axios";

export const getShowtimes = (movieId) =>
  api.get("/showtimes", { params: movieId ? { movie: movieId } : {} });
export const getShowtime = (id) => api.get(`/showtimes/${id}`);
export const getAllShowtimesAdmin = (movieId) =>
  api.get("/showtimes/admin/all", { params: movieId ? { movie: movieId } : {} });
export const createShowtime = (data) => api.post("/showtimes", data);
export const updateShowtime = (id, data) => api.put(`/showtimes/${id}`, data);
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`);