import { useEffect, useState } from "react";
import {
  getAllMoviesAdmin, createMovie, updateMovie, deleteMovie, toggleMovieActive,
} from "../../api/movieApi";
import toast from "react-hot-toast";

const EMPTY = {
  title: "", genre: "", duration: "", rating: "", description: "",
  poster: "", releaseType: "now_showing", releaseDate: "",
};

const MovieFormModal = ({ movie, onClose, onSaved }) => {
  const [form, setForm] = useState(movie || EMPTY);
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, poster: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (movie?._id) {
        await updateMovie(movie._id, form);
        toast.success("Movie updated!");
      } else {
        await createMovie(form);
        toast.success("Movie added!");
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gold";
  const labelCls = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
        className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gold">{movie ? "Edit Movie" : "Add New Movie"}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gold text-2xl">&times;</button>
        </div>

        <div><label className={labelCls}>Title *</label>
          <input className={inputCls} value={form.title} required
            onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Genre *</label>
            <input className={inputCls} value={form.genre} required
              onChange={(e) => setForm({ ...form, genre: e.target.value })} /></div>
          <div><label className={labelCls}>Duration *</label>
            <input className={inputCls} placeholder="2h 15m" value={form.duration} required
              onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div><label className={labelCls}>Rating</label>
            <input className={inputCls} placeholder="4.5" value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          <div><label className={labelCls}>Type</label>
            <select className={inputCls} value={form.releaseType}
              onChange={(e) => setForm({ ...form, releaseType: e.target.value })}>
              <option value="now_showing">Now Showing</option>
              <option value="coming_soon">Coming Soon</option>
            </select></div>
        </div>

        <div><label className={labelCls}>Description *</label>
          <textarea rows="3" className={inputCls} value={form.description} required
            onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>

        {form.releaseType === "coming_soon" && (
          <div><label className={labelCls}>Release Date</label>
            <input type="date" className={inputCls} value={form.releaseDate?.slice?.(0, 10) || ""}
              onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} /></div>
        )}

        <div>
          <label className={labelCls}>Poster {movie ? "" : "*"}</label>
          {form.poster && typeof form.poster === "string" && !form.poster.startsWith("data:") && (
            <img src={form.poster} alt="poster" className="h-40 object-cover rounded-xl mb-2" />
          )}
          <input type="file" accept="image/*" onChange={handleImage}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold file:text-black file:font-semibold" />
          <p className="text-[11px] text-gray-600 mt-1">Or paste an image URL:</p>
          <input className={inputCls + " mt-1"} placeholder="https://..." value={form.poster.startsWith("data:") ? "(uploaded file)" : form.poster}
            onChange={(e) => setForm({ ...form, poster: e.target.value })} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-sm">Cancel</button>
          <button disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-golddark text-black font-semibold text-sm disabled:opacity-50">
            {saving ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | movie object

  const fetchMovies = async () => {
    try {
      const res = await getAllMoviesAdmin();
      setMovies(res.data);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie and ALL its showtimes?")) return;
    try {
      await deleteMovie(id);
      toast.success("Movie deleted");
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMovieActive(id);
      fetchMovies();
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Movies</h1>
          <p className="text-sm text-gray-500">Add, edit and manage the movie catalogue.</p>
        </div>
        <button onClick={() => setModal("add")}
          className="bg-gradient-to-r from-gold to-golddark text-black font-semibold px-5 py-2.5 rounded-xl text-sm">
          + Add Movie
        </button>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[720px]">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Movie</th>
              <th className="px-5 py-3.5">Genre</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : movies.length === 0 ? (
              <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-500">No movies yet. Add your first movie!</td></tr>
            ) : (
              movies.map((m) => (
                <tr key={m._id} className="hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {m.poster && <img src={m.poster} alt="" className="w-10 h-14 object-cover rounded-md" />}
                      <span className="text-white font-medium">{m.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{m.genre}</td>
                  <td className="px-5 py-3.5 text-gray-400">{m.duration}</td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {m.releaseType === "now_showing" ? "Now Showing" : "Coming Soon"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleToggle(m._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${m.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {m.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button onClick={() => setModal(m)}
                      className="text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg">Edit</button>
                    <button onClick={() => handleDelete(m._id)}
                      className="text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <MovieFormModal
          movie={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchMovies}
        />
      )}
    </div>
  );
};

export default MoviesPage;