import { useState } from "react";
import { getTicketsByEmail, getTicketByCode } from "../../api/bookingApi";
import Ticket from "../../components/Ticket";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

const MyTicketsPage = () => {
  const [mode, setMode] = useState("email");
  const [query, setQuery] = useState("");
  const [tickets, setTickets] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      if (mode === "email") {
        const res = await getTicketsByEmail(query.trim());
        setTickets(res.data);
      } else {
        const res = await getTicketByCode(query.trim().toUpperCase());
        setTickets([res.data]);
      }
      setSearched(true);
    } catch {
      setTickets([]);
      setSearched(true);
      toast.error("No tickets found");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold text-gold text-center mb-2">Find My Tickets</h1>
      <p className="text-gray-400 text-sm text-center mb-8">Enter your email or ticket number to retrieve your tickets.</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="flex gap-2">
          {["email", "code"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                mode === m ? "bg-gold text-black" : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {m === "email" ? "By Email" : "By Ticket No."}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === "email" ? "you@example.com" : "CIN-XXXXXX"}
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold"
        />
        <button className="bg-gradient-to-r from-gold to-golddark text-black font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2">
          <Search size={16} /> Find
        </button>
      </form>

      {searched && tickets.length === 0 && (
        <p className="text-center text-gray-500">No tickets found for that {mode === "email" ? "email" : "ticket number"}.</p>
      )}

      <div className="space-y-10">
        {tickets.map((t) => <Ticket key={t.ticketCode} booking={t} />)}
      </div>
    </div>
  );
};

export default MyTicketsPage;