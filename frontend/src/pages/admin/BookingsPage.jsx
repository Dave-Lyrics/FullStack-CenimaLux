import { useEffect, useState } from "react";
import { getBookings } from "../../api/bookingApi";
import { downloadTicketPDF } from "../../api/bookingApi";
import Ticket from "../../components/Ticket";
import toast from "react-hot-toast";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Bookings</h1>
      <p className="text-sm text-gray-500 mb-6">All ticket sales. You can view or re-download any ticket.</p>

      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[760px]">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Ticket No.</th>
              <th className="px-5 py-3.5">Movie</th>
              <th className="px-5 py-3.5">Guest</th>
              <th className="px-5 py-3.5">Showtime</th>
              <th className="px-5 py-3.5">Seats</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-500">No bookings yet.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-white/5">
                  <td className="px-5 py-3.5 text-gold font-medium">{b.ticketCode}</td>
                  <td className="px-5 py-3.5 text-white">{b.movieTitle}</td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {b.customerName}<br /><span className="text-xs text-gray-600">{b.email}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {new Date(b.showDate).toDateString()}<br />{b.showTime}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{b.seats.join(", ")}</td>
                  <td className="px-5 py-3.5 text-gray-400">N{Number(b.amount).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => setViewing(b)}
                      className="text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg">View</button>
                    <button onClick={() => downloadTicketPDF(b.ticketCode)}
                      className="text-xs font-medium text-gold bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-lg">PDF</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setViewing(null)}>
          <div className="py-10" onClick={(e) => e.stopPropagation()}>
            <Ticket booking={viewing} />
            <p className="text-center mt-4">
              <button onClick={() => setViewing(null)} className="text-gray-400 text-sm hover:text-gold">Close</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;