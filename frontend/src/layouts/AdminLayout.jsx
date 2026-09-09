import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut, LayoutDashboard, Clapperboard, Clock, Ticket, ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all
    ${isActive(path)
      ? "bg-gold text-black shadow-md shadow-gold/20"
      : "text-gray-300 hover:bg-white/5 hover:text-gold"}
  `;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0d0d0d] w-full">
      <aside className="w-full md:w-64 bg-cinema border-b md:border-b-0 md:border-r border-white/10 md:fixed md:top-0 md:left-0 md:h-screen flex flex-col z-40">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h2 className="text-lg font-bold text-gold tracking-wide">CINEMALUX</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Control Panel</p>
        </div>

        <nav className="flex flex-row md:flex-col p-2 md:p-4 gap-1.5 overflow-x-auto md:overflow-visible flex-1">
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/movies" className={linkClass("/admin/movies")}>
            <Clapperboard size={18} /> <span>Movies</span>
          </Link>
          <Link to="/admin/showtimes" className={linkClass("/admin/showtimes")}>
            <Clock size={18} /> <span>Showtimes</span>
          </Link>
          <Link to="/admin/bookings" className={linkClass("/admin/bookings")}>
            <Ticket size={18} /> <span>Bookings</span>
          </Link>
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-gray-300 hover:bg-white/5 hover:text-gold">
            <ExternalLink size={18} /> <span>View Site</span>
          </a>
        </nav>

        <div className="p-2 md:p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start gap-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl px-4 py-3 text-sm font-semibold transition-all"
          >
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen md:pl-64">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;