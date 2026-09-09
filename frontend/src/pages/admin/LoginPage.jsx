import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthShell, AuthInput, AuthButton } from "./authShared";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(form.email.trim().toLowerCase(), form.password);
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      subtitle="Admin Login"
      footer={
        <div className="flex justify-center gap-4">
          <Link to="/admin/forgot-password" className="text-gold hover:underline text-sm">Forgot Password?</Link>
          <Link to="/admin/signup" className="text-gold hover:underline text-sm">Create Admin</Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput type="email" placeholder="Email Address" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <AuthInput type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <AuthButton loading={loading}>Login</AuthButton>
      </form>
    </AuthShell>
  );
};

export default LoginPage;