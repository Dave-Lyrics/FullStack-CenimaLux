import { Link } from "react-router-dom";

export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-gradient-to-br from-black via-[#16213e] to-black flex items-center justify-center px-4 py-10">
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gold tracking-wide">CINEMA<span className="text-white">LUX</span></h1>
        <p className="text-gray-300 text-sm mt-1">{subtitle}</p>
      </div>
      {children}
      {footer && <div className="mt-6 text-center text-sm text-gray-400">{footer}</div>}
    </div>
  </div>
);

export const AuthInput = (props) => (
  <input
    {...props}
    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 outline-none focus:border-gold transition text-sm"
  />
);

export const AuthButton = ({ loading, children }) => (
  <button
    disabled={loading}
    className="w-full bg-gradient-to-r from-gold to-golddark text-black font-bold rounded-xl py-3 transition disabled:opacity-50"
  >
    {loading ? "Please wait..." : children}
  </button>
);

export const BackLink = ({ to, label }) => (
  <Link to={to} className="text-sm text-gold hover:underline">&larr; {label}</Link>
);