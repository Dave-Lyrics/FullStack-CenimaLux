import { useEffect, useState } from "react";
import { getMovies } from "../../api/movieApi";
import MovieModal from "../../components/MovieModal";

const MovieCard = ({ movie, onClick }) => (
  <div onClick={onClick} className="group bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-gold/40 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/10">
    <div className="h-72 overflow-hidden relative">
      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </div>
    <div className="p-5">
      <h3 className="text-gold font-semibold text-lg">{movie.title}</h3>
      <p className="text-gray-500 text-xs mt-0.5">{movie.genre}</p>
      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{movie.description}</p>
    </div>
  </div>
);

const HomePage = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMovies("now_showing").then((res) => setNowShowing(res.data)).catch(() => {});
    getMovies("coming_soon").then((res) => setComingSoon(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section id="hero-bg" className="min-h-[70vh] flex items-center justify-center text-center px-5 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gold to-golddark bg-clip-text text-transparent mb-4">
            Experience Cinema Like Never Before
          </h1>
          <p className="text-gray-300 mb-8">Book tickets in seconds. Pay securely with Paystack. Get your ticket instantly by PDF or email.</p>
          <button
            onClick={() => document.getElementById("now-showing")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-gold to-golddark text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/30 transition-all"
          >
            Book Now
          </button>
        </div>
      </section>

      <section id="now-showing" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-bold text-gold text-center mb-10">Now Showing</h2>
        {nowShowing.length === 0 ? (
          <p className="text-center text-gray-500">No movies showing right now — the admin hasn&#39;t added any yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nowShowing.map((m) => <MovieCard key={m._id} movie={m} onClick={() => setSelected(m)} />)}
          </div>
        )}
      </section>

      {comingSoon.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <h2 className="text-3xl font-bold text-gold text-center mb-10">Coming Soon</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoon.map((m) => (
              <div key={m._id} className="bg-[#141414] rounded-2xl overflow-hidden border border-white/5">
                <img src={m.poster} alt={m.title} className="h-56 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-gold font-semibold">{m.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {m.releaseDate ? new Date(m.releaseDate).toDateString() : "Coming soon"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default HomePage;