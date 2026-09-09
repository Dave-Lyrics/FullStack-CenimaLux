import { useEffect, useState } from "react";
import { getAllMoviesAdmin } from "../../api/movieApi";
import {
  getAllShowtimesAdmin, createShowtime, deleteShowtime,
} from "../../api/showtimeApi";
import toast from "react-hot-toast";

const ShowtimesPage = () => {
  const [movies, setMovies] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [form, setForm] = useState({ date: "", time: "", screen: "Hall 1", price: "", rows: 8, seatsPerRow: 10 });

  useEffect(() => {
    getAllMoviesAdmin().then((res) => {
      setMovies(res.data);
      if (res.data.length > 0) setMovieId(res.data[0]._id);
    }).catch(() => toast.error("Failed to load movies"));
  }, []);

  const fetchShowtimes = async (id) => {
    try {
      const res = await getAllShowtimesAdmin(id);
      setShowtimes(res.data);
    } catch {
      toast.error("Failed to load showtimes");
    }
  };

  useEffect(() => {
    if (movieId) fetchShowtimes(movieId);
  }, [movieId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createShowtime({ ...form, movie: movieId, price: Number(form.price), rows: Number(form.rows), seatsPerRow: Number(form.seatsPerRow) });
      toast.success("Showtime added!");
      setForm({ ...form, date: "", time: "", price: "" });
      fetchShowtimes(movieId);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add showtime");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this showtime? Sold seats info will be lost.")) return;
    try {
      await deleteShowtime(id);
      toast.success("Showtime deleted");
      fetchShowtimes(movieId);
    } catch {
      toast.error("Delete failed");
    }
  };

  const inputCls = "bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-gold";

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Showtimes</h1>
      <p className="text-sm text-gray-500 mb-6">Set dates, times, prices and hall layouts for each movie. Seats are tracked per showtime — nothing is hardcoded.</p>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Movie</label>
        <select value={movieId} onChange={(e) => setMovieId(e.target.value)} className={inputCls + " w-full sm:w-96"}>
          {movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
        </select>
      </div>

      <form onSubmit={handleCreate} className="bg-[#141414] border border-white/10 rounded-2xl p-5 mb-8">
        <h2 className="text-gold font-semibold mb-4">Add Showtime</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <input type="date" required className={inputCls} value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input type="time" required className={inputCls} value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <input placeholder="Screen e.g. Hall 1" className={inputCls} value={form.screen}
            onChange={(e) => setForm({ ...form, screen: e.target.value })} />
          <input type="number" min="0" placeholder="Price NGN" required className={inputCls} value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" min="1" max="20" placeholder="Rows" className={inputCls} value={form.rows}
            onChange={(e) => setForm({ ...form, rows: e.target.value })} />
          <input type="number" min="1" max="20" placeholder="Seats/row" className={inputCls} value={form.seatsPerRow}
            onChange={(e) => setForm({ ...form, seatsPerRow: e.target.value })} />
        </div>
        <button className="mt-4 bg-gradient-to-r from-gold to-golddark text-black font-semibold px-5 py-2.5 rounded-xl text-sm">
          Add Showtime
        </button>
      </form>

      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[640px]">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Time</th>
              <th className="px-5 py-3.5">Screen</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Layout</th>
              <th className="px-5 py-3.5">Seats Sold</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {showtimes.length === 0 ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-500">No showtimes for this movie yet.</td></tr>
            ) : (
              showtimes.map((st) => (
                <tr key={st._id} className="hover:bg-white/5">
                  <td className="px-5 py-3.5 text-white">{new Date(st.date).toDateString()}</td>
                  <td className="px-5 py-3.5 text-white">{st.time}</td>
                  <td className="px-5 py-3.5 text-gray-400">{st.screen}</td>
                  <td className="px-5 py-3.5 text-gray-400">N{st.price.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-400">{st.rows} x {st.seatsPerRow}</td>
                  <td className="px-5 py-3.5 text-gold font-medium">{st.occupiedSeats.length} / {st.rows * st.seatsPerRow}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => handleDelete(st._id)}
                      className="text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowtimesPage;