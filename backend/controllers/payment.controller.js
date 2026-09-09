import axios from "axios";
import Showtime from "../models/Showtime.js";
import Booking from "../models/Booking.js";
import { generateTicketCode } from "../lib/ticketCode.js";
import { sendEmail } from "../lib/email.js";
import { TICKET_EMAIL_TEMPLATE } from "../templates/emailTemplates.js";

const clean = (val) => val || "";

const isValidSeat = (showtime, seat) => {
  const match = /^([A-Z])(\d+)$/.exec(seat);
  if (!match) return false;
  const rowIndex = match[1].charCodeAt(0) - 65;
  const num = Number(match[2]);
  return rowIndex >= 0 && rowIndex < showtime.rows && num >= 1 && num <= showtime.seatsPerRow;
};

export const sendTicketEmail = async (booking) => {
  await sendEmail({
    to: booking.email,
    subject: `Your CinemaLux Ticket - ${booking.movieTitle}`,
    html: TICKET_EMAIL_TEMPLATE.replaceAll("{movieTitle}", clean(booking.movieTitle))
      .replaceAll("{ticketCode}", clean(booking.ticketCode))
      .replaceAll("{showDate}", new Date(booking.showDate).toDateString())
      .replaceAll("{showTime}", clean(booking.showTime))
      .replaceAll("{screen}", clean(booking.screen))
      .replaceAll("{customerName}", clean(booking.customerName))
      .replaceAll("{seats}", booking.seats.join(", "))
      .replaceAll("{amount}", Number(booking.amount).toLocaleString())
      .replaceAll("{paymentReference}", clean(booking.paymentReference)),
  });
  booking.ticketEmailSent = true;
  await booking.save();
};

// Step 1 - initialize Paystack checkout (amount in NGN, Paystack takes kobo)
export const initializePayment = async (req, res) => {
  try {
    const { showtimeId, seats, name, email, phone } = req.body;
    if (!showtimeId || !Array.isArray(seats) || seats.length === 0 || !name || !email) {
      return res.status(400).json({ error: "Showtime, seats, name and email are required" });
    }
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });

    for (const seat of seats) {
      if (!isValidSeat(showtime, seat)) {
        return res.status(400).json({ error: `Invalid seat: ${seat}` });
      }
      if (showtime.occupiedSeats.includes(seat)) {
        return res.status(400).json({ error: `Seat ${seat} is already taken. Pick another seat.` });
      }
    }

    const amountNGN = showtime.price * seats.length;
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountNGN * 100,
        currency: "NGN",
        metadata: { showtimeId, seats, name, email, phone: phone || "", paymentType: "ticket" },
        callback_url: `${process.env.FRONTEND_URL}/payment/success`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      amountToPay: amountNGN,
    });
  } catch (error) {
    console.log("Initialize Payment Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to initialize payment" });
  }
};

// Step 2 - Paystack redirects back with ?reference=... we verify, lock seats, create ticket
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference) return res.status(400).json({ error: "Payment reference is required" });

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const data = response.data.data;
    if (data.status !== "success") {
      return res.status(400).json({ error: "Payment was not successful" });
    }

    // Idempotency - don't create a duplicate ticket if page is refreshed
    const existing = await Booking.findOne({ paymentReference: reference });
    if (existing) {
      return res.status(200).json({ success: true, booking: existing, alreadyVerified: true });
    }

    const { showtimeId, seats, name, email, phone } = data.metadata || {};
    if (!showtimeId || !seats) {
      return res.status(400).json({ error: "Booking metadata missing from payment" });
    }

    const showtime = await Showtime.findById(showtimeId).populate("movie", "title");
    if (!showtime) return res.status(404).json({ error: "Showtime no longer exists" });

    const expectedAmount = showtime.price * seats.length * 100;
    if (data.amount !== expectedAmount) {
      return res.status(400).json({ error: "Paid amount does not match the ticket price" });
    }

    // ATOMIC seat lock - fails if ANY seat got taken while customer was paying
    const result = await Showtime.updateOne(
      { _id: showtimeId, occupiedSeats: { $nin: seats } },
      { $addToSet: { occupiedSeats: { $each: seats } } }
    );
    if (result.modifiedCount === 0) {
      return res.status(409).json({
        error: "One or more seats were just taken. Please pick different seats.",
      });
    }

    const booking = await Booking.create({
      ticketCode: generateTicketCode(),
      showtime: showtimeId,
      movieTitle: showtime.movie.title,
      showDate: showtime.date,
      showTime: showtime.time,
      screen: showtime.screen,
      customerName: name,
      email,
      phone: phone || "",
      seats,
      amount: showtime.price * seats.length,
      paymentReference: reference,
      paymentStatus: "paid",
    });

    // Send the ticket email - a failed email must NOT fail the payment
    try {
      await sendTicketEmail(booking);
    } catch (emailError) {
      console.error("Ticket email error (payment still valid):", emailError.message);
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.log("Verify Payment Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
};