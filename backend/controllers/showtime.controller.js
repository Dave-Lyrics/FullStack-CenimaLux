import Showtime from "../models/Showtime.js";

export const createShowtime = async (req, res) => {
  try {
    const { movie, date, time, screen, price, rows, seatsPerRow } = req.body;
    if (!movie || !date || !time || !price) {
      return res.status(400).json({ error: "Movie, date, time and price are required" });
    }
    const showtime = await Showtime.create({
      movie,
      date,
      time,
      screen: screen || "Hall 1",
      price,
      rows: rows || 8,
      seatsPerRow: seatsPerRow || 10,
    });
    res.status(201).json(showtime);
  } catch (error) {
    console.log("Create Showtime Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Public - get showtimes for a movie (upcoming only)
export const getShowtimes = async (req, res) => {
  try {
    const { movie } = req.query;
    const filter = { active: true };
    if (movie) filter.movie = movie;
    filter.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    const showtimes = await Showtime.find(filter).sort({ date: 1, time: 1 });
    res.status(200).json(showtimes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Public - seat map with live occupied seats (NOT hardcoded)
export const getShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate("movie");
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    res.status(200).json(showtime);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllShowtimesAdmin = async (req, res) => {
  try {
    const { movie } = req.query;
    const filter = {};
    if (movie) filter.movie = movie;
    const showtimes = await Showtime.find(filter)
      .populate("movie", "title")
      .sort({ date: -1, time: -1 });
    res.status(200).json(showtimes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    const { date, time, screen, price, active } = req.body;
    if (date) showtime.date = date;
    if (time) showtime.time = time;
    if (screen) showtime.screen = screen;
    if (price) showtime.price = price;
    if (active !== undefined) showtime.active = active;
    await showtime.save();
    res.status(200).json(showtime);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    await Showtime.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};