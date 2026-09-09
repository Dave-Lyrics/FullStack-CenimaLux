import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cinema space-y-4">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase animate-pulse">
          Authenticating Session...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedRoute;