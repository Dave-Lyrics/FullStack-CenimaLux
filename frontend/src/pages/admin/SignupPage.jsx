import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/authApi";
import { AuthShell, AuthInput, AuthButton } from "./authShared";
import toast from "react-hot-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signup(form);
      toast.success("Admin account created!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      subtitle="Create the admin account (only one is allowed)"
      footer={<p>Already have an account? <Link to="/admin/login" className="text-gold hover:underline">Login</Link></p>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput placeholder="Full Name" value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <AuthInput type="email" placeholder="Email Address" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <AuthInput type="password" placeholder="Password (8+ chars, upper, lower, number, symbol)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <AuthButton loading={loading}>Create Admin Account</AuthButton>
      </form>
    </AuthShell>
  );
};

export default SignupPage;