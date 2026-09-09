import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import { AuthShell, AuthInput, AuthButton, BackLink } from "./authShared";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await forgotPassword({ email });
      toast.success(res.data.message);
      navigate("/admin/verify-reset-code", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell subtitle="Enter your admin email and we'll send you a 6-digit verification code.">
      <div className="mb-6"><BackLink to="/admin/login" label="Back to Login" /></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput type="email" placeholder="Admin Email Address" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <AuthButton loading={loading}>Send Verification Code</AuthButton>
      </form>
    </AuthShell>
  );
};

export default ForgotPasswordPage;