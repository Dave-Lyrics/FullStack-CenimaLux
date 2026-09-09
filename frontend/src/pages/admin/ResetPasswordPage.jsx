import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { AuthShell, AuthInput, AuthButton } from "./authShared";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Reset session invalid");
      return navigate("/admin/forgot-password");
    }
    if (form.newPassword !== form.confirmPassword) return toast.error("Passwords do not match");
    try {
      setLoading(true);
      const res = await resetPassword({ email, ...form });
      toast.success(res.data.message);
      navigate("/admin/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell subtitle="Create a new secure password for your admin account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput type="password" placeholder="New Password" value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
        <AuthInput type="password" placeholder="Confirm New Password" value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
        <p className="text-xs text-gray-500">
          At least 8 characters with uppercase, lowercase, a number and a special character.
        </p>
        <AuthButton loading={loading}>Reset Password</AuthButton>
      </form>
    </AuthShell>
  );
};

export default ResetPasswordPage;