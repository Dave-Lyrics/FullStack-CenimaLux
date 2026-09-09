import express from "express";
import {
  getBookings, getTicketByCode, getTicketsByEmail,
  downloadTicketPDF, emailTicket,
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getBookings);
router.get("/lookup", getTicketsByEmail);          // public - find my tickets
router.get("/ticket/:code", getTicketByCode);      // public
router.get("/ticket/:code/pdf", downloadTicketPDF); // public - instant PDF
router.post("/ticket/:code/email", emailTicket);    // public - send to mail

export default router;