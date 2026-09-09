import { useEffect, useState } from "react";
import { getMovies } from "../../api/movieApi";
import { getBookings } from "../../api/bookingApi";
import { getAllShowtimesAdmin } from "../../api/showtimeApi";
import { Clapperboard, Clock, Ticket, Wallet, Loader2 } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}><Icon size={22} /></div>
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [movies, showtimes, bookings] = await Promise.all([
          getMovies(), getAllShowtimesAdmin(), getBookings(),
        ]);
        const revenue = bookings.data.reduce((sum, b) => sum + (b.amount || 0), 0);
        setStats({
          movies: movies.data.length,
          showtimes: showtimes.data.length,
          bookings: bookings.data.length,
          revenue,
          recent: bookings.data.slice(0, 8),
        });
      } catch {
        setStats({ movies: 0, showtimes: 0, bookings: 0, revenue: 0, recent: [] });
      }
    };
    load();
  }, []);

  if (!stats) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-gold animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Clapperboard} label="Movies" value={stats.movies} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Clock} label="Showtimes" value={stats.showtimes} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={Ticket} label="Bookings" value={stats.bookings} color="bg-gold/20 text-gold" />
        <StatCard icon={Wallet} label="Revenue" value={`N${stats.revenue.toLocaleString()}`} color="bg-green-500/20 text-green-400" />
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Recent Bookings</h2>
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[640px]">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Ticket</th>
              <th className="px-5 py-3.5">Movie</th>
              <th className="px-5 py-3.5">Guest</th>
              <th className="px-5 py-3.5">Seats</th>
              <th className="px-5 py-3.5">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.recent.length === 0 ? (
              <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-500">No bookings yet.</td></tr>
            ) : (
              stats.recent.map((b) => (
                <tr key={b._id} className="hover:bg-white/5">
                  <td className="px-5 py-3.5 text-gold font-medium">{b.ticketCode}</td>
                  <td className="px-5 py-3.5 text-white">{b.movieTitle}</td>
                  <td className="px-5 py-3.5 text-gray-400">{b.customerName}</td>
                  <td className="px-5 py-3.5 text-gray-400">{b.seats.join(", ")}</td>
                  <td className="px-5 py-3.5 text-gray-400">N{Number(b.amount).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;