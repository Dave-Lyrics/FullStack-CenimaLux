import api from "../lib/axios";

export const getBookings = () => api.get("/bookings");
export const getTicketByCode = (code) => api.get(`/bookings/ticket/${code}`);
export const getTicketsByEmail = (email) =>
  api.get("/bookings/lookup", { params: { email } });
export const emailTicket = (code) => api.post(`/bookings/ticket/${code}/email`);

export const downloadTicketPDF = (code) => {
  // Direct browser download from the backend PDF endpoint
  window.open(
    `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings/ticket/${code}/pdf`,
    "_blank"
  );
};