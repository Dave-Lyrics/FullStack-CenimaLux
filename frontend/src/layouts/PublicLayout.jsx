import { Outlet, Link } from "react-router-dom";
import { Clapperboard } from "lucide-react";

const PublicLayout = () => (
  <div className="min-h-screen bg-cinema text-white flex flex-col">
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Clapperboard className="text-gold" size={24} />
          <span className="text-xl font-bold text-gold tracking-wide">CINEMA<span className="text-white">LUX</span></span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-300 hover:text-gold transition">Movies</Link>
          <Link to="/my-tickets" className="text-gray-300 hover:text-gold transition">My Tickets</Link>
        </div>
      </div>
    </nav>

    <main className="flex-1 pt-16">
      <Outlet />
    </main>

    <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
      <p className="text-gold font-semibold mb-1">CinemaLux</p>
      <p>&copy; {new Date().getFullYear()} CinemaLux. All rights reserved.</p>
    </footer>
  </div>
);

export default PublicLayout;