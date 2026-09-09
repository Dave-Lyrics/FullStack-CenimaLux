import { Download, Mail, Clapperboard } from "lucide-react";
import { downloadTicketPDF, emailTicket } from "../api/bookingApi";
import toast from "react-hot-toast";

const Ticket = ({ booking, showActions = true }) => {
  const handleEmail = async () => {
    try {
      await emailTicket(booking.ticketCode);
      toast.success("Ticket sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send email");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 border border-white/10">
        {/* ---- Main body ---- */}
        <div className="flex-1 bg-gradient-to-br from-[#141414] to-[#1d1d1d] p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold to-golddark" />
          <div className="flex items-center gap-2 mb-5 mt-1">
            <Clapperboard size={18} className="text-gold" />
            <span className="text-gold font-bold tracking-widest text-sm">CINEMALUX</span>
            <span className="text-gray-600 text-[10px] tracking-[0.3em] ml-auto">ADMIT {booking.seats.length}</span>
          </div>

          <p className="text-gray-500 text-[10px] tracking-widest mb-1">MOVIE</p>
          <h3 className="text-white font-bold text-xl leading-tight mb-5">{booking.movieTitle}</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-gray-500 text-[10px] tracking-widest mb-0.5">DATE</p>
              <p className="text-white text-sm font-semibold">{new Date(booking.showDate).toDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] tracking-widest mb-0.5">TIME</p>
              <p className="text-white text-sm font-semibold">{booking.showTime}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] tracking-widest mb-0.5">SCREEN</p>
              <p className="text-white text-sm font-semibold">{booking.screen || "Hall 1"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] tracking-widest mb-0.5">SEATS</p>
              <p className="text-gold text-sm font-bold">{booking.seats.join(", ")}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] tracking-widest mb-0.5">GUEST</p>
              <p className="text-white text-sm font-semibold truncate">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] tracking-widest mb-0.5">PAID</p>
              <p className="text-white text-sm font-semibold">&#8358;{Number(booking.amount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ---- Perforation + Stub ---- */}
        <div className="ticket-perforation w-full sm:w-44 bg-[#141414] p-5 flex sm:flex-col items-center justify-between gap-3 border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-gray-700">
          <div className="text-center">
            <p className="text-gray-500 text-[9px] tracking-widest mb-1">TICKET NO.</p>
            <p className="text-gold font-bold text-base">{booking.ticketCode}</p>
          </div>
          <div className="barcode h-12 w-24 sm:w-full" />
          <p className="text-gray-600 text-[9px] text-center tracking-wider">{booking.ticketCode} &bull; {booking.seats.join(" ")}</p>
        </div>
      </div>

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={() => downloadTicketPDF(booking.ticketCode)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-golddark text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
          >
            <Download size={18} /> Save as PDF
          </button>
          <button
            onClick={handleEmail}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition"
          >
            <Mail size={18} /> Send to Email
          </button>
        </div>
      )}
    </div>
  );
};

export default Ticket;