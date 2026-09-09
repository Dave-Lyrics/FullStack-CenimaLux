import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    rating: { type: String, default: "TBD" },
    description: { type: String, required: true },
    poster: { type: String, default: "" },
    posterPublicId: { type: String, default: "" },
    releaseType: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "now_showing",
    },
    releaseDate: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;