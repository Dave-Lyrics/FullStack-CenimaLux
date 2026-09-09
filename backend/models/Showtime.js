import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g. "18:30"
    screen: { type: String, default: "Hall 1" },
    price: { type: Number, required: true }, // NGN, per seat
    rows: { type: Number, default: 8 },
    seatsPerRow: { type: Number, default: 10 },
    occupiedSeats: { type: [String], default: [] }, // ["A1","A2",...]
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Showtime = mongoose.model("Showtime", showtimeSchema);
export default Showtime;