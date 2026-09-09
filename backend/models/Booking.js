import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, unique: true, trim: true },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    // Snapshots so the ticket stays valid even if movie/showtime is edited later
    movieTitle: { type: String, required: true },
    showDate: { type: Date, required: true },
    showTime: { type: String, required: true },
    screen: { type: String, default: "Hall 1" },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    seats: { type: [String], required: true },
    amount: { type: Number, required: true }, // NGN total paid
    paymentReference: { type: String, unique: true, sparse: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "paid",
    },
    ticketEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;