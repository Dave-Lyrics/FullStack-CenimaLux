import Booking from "../models/Booking.js";
import { buildTicketPDF } from "../lib/ticketPdf.js";
import { sendTicketEmail } from "./payment.controller.js";

// Admin - all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Public - lookup by ticket code
export const getTicketByCode = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.code });
    if (!booking) return res.status(404).json({ error: "Ticket not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Public - lookup all tickets by email (type your email to find your tickets)
export const getTicketsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const bookings = await Booking.find({ email: email.trim().toLowerCase() })
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Instant PDF download - /api/bookings/ticket/:code/pdf
export const downloadTicketPDF = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.code });
    if (!booking) return res.status(404).json({ error: "Ticket not found" });
    buildTicketPDF(booking, res);
  } catch (error) {
    console.log("PDF Error:", error.message);
    res.status(500).json({ error: "Failed to generate ticket PDF" });
  }
};

// Resend ticket email - /api/bookings/ticket/:code/email
export const emailTicket = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.code });
    if (!booking) return res.status(404).json({ error: "Ticket not found" });
    await sendTicketEmail(booking);
    res.status(200).json({ success: true, message: "Ticket sent to your email" });
  } catch (error) {
    console.log("Email Ticket Error:", error.message);
    res.status(500).json({ error: "Failed to send ticket email" });
  }
};