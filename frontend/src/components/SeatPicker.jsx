const SeatPicker = ({ showtime, selectedSeats, onToggle }) => {
  const rows = showtime.rows || 8;
  const seatsPerRow = showtime.seatsPerRow || 10;

  return (
    <div>
      {/* Screen */}
      <div className="relative mb-8">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="text-center text-gold text-xs font-semibold tracking-[0.4em] mt-2">SCREEN</p>
      </div>

      <div className="flex flex-col items-center gap-2 overflow-x-auto pb-2">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const letter = String.fromCharCode(65 + rowIndex);
          return (
            <div key={letter} className="flex items-center gap-2">
              <span className="text-gray-500 text-xs w-4">{letter}</span>
              {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                const seatId = `${letter}${seatIndex + 1}`;
                const occupied = showtime.occupiedSeats?.includes(seatId);
                const selected = selectedSeats.includes(seatId);
                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={occupied}
                    onClick={() => onToggle(seatId)}
                    className={`
                      w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg text-[9px] font-semibold transition-all
                      ${occupied
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : selected
                        ? "bg-gold text-black scale-110 shadow-lg shadow-gold/30"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-600 hover:text-gold border border-gray-700"}
                    `}
                  >
                    {seatIndex + 1}
                  </button>
                );
              })}
              <span className="text-gray-500 text-xs w-4">{letter}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
        <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-gray-800 border border-gray-700 inline-block" /> Available</span>
        <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-gold inline-block" /> Selected</span>
        <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-gray-700 inline-block" /> Sold</span>
      </div>
    </div>
  );
};

export default SeatPicker;