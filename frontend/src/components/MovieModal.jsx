import { useEffect, useState } from "react";
import { X, Clock, Star } from "lucide-react";
import { getShowtimes, getShowtime } from "../api/showtimeApi";
import { initializePayment } from "../api/paymentApi";
import SeatPicker from "./SeatPicker";
import toast from "react-hot-toast";

const MovieModal = ({ movie, onClose }) => {
  const [step, setStep] = useState("showtimes"); // showtimes | seats | paying
  const [showtimes, setShowtimes] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    getShowtimes(movie._id)
      .then((res) => setShowtimes(res.data))
      .catch(() => toast.error("Could not load showtimes"));
  }, [movie._id]);

  const pickShowtime = async (id) => {
    try {
      const res = await getShowtime(id); // fresh seat map - not hardcoded
      setShowtime(res.data);
      setSelectedSeats([]);
      setStep("seats");
    } catch {
      toast.error("Could not load seat map");
    }
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const total = showtime ? showtime.price * selectedSeats.length : 0;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return toast.error("Please enter your name and email");
    }
    try {
      setStep("paying");
      const res = await initializePayment({
        showtimeId: showtime._id,
        seats: selectedSeats,
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      // Redirect to Paystack secure checkout
      window.location.href = res.data.authorization_url;
    } catch (error) {
      setStep("seats");
      toast.error(error.response?.data?.error || "Could not start payment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div
        className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-5 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-gold">{movie.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
              <span>{movie.genre}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {movie.duration}</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-gold" /> {movie.rating}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gold text-2xl leading-none">&times;</button>
        </div>

        <div className="p-5">
          {step === "showtimes" && (
            <>
              <p className="text-gray-400 text-sm mb-4">{movie.description}</p>
              <h3 className="text-white font-semibold mb-3">Select a Showtime</h3>
              {showtimes.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming showtimes for this movie yet.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {showtimes.map((st) => (
                    <button
                      key={st._id}
                      onClick={() => pickShowtime(st._id)}
                      className="bg-white/5 border border-white/10 hover:border-gold hover:text-gold rounded-xl px-4 py-3 text-sm transition text-left"
                    >
                      <p className="font-semibold text-white group-hover:text-gold">{st.time}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(st.date).toDateString()} &bull; {st.screen} &bull; &#8358;{st.price.toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === "seats" && showtime && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStep("showtimes")} className="text-sm text-gray-400 hover:text-gold">&larr; Back to showtimes</button>
                <p className="text-sm text-gray-400">
                  {new Date(showtime.date).toDateString()} &bull; {showtime.time} &bull; {showtime.screen} &bull; &#8358;{showtime.price.toLocaleString()}/seat
                </p>
              </div>

              <SeatPicker showtime={showtime} selectedSeats={selectedSeats} onToggle={toggleSeat} />

              <form onSubmit={handlePay} className="mt-6 border-t border-white/10 pt-5">
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <input required placeholder="Full name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  <input required type="email" placeholder="Email (ticket goes here)" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                  <input placeholder="Phone (optional)" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
                </div>
                <button
                  type="submit"
                  disabled={selectedSeats.length === 0 || step === "paying"}
                  className="w-full bg-gradient-to-r from-gold to-golddark text-black font-bold py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  {step === "paying"
                    ? "Redirecting to Paystack..."
                    : `Pay ${total.toLocaleString()} NGN for ${selectedSeats.length} seat${selectedSeats.length === 1 ? "" : "s"}${selectedSeats.length ? ` (${selectedSeats.join(", ")})` : ""}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;