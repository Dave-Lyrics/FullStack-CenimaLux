import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyResetCode } from "../../api/authApi";
import { AuthShell, AuthInput, AuthButton, BackLink } from "./authShared";
import toast from "react-hot-toast";

const VerifyResetCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please request a new reset code");
      return navigate("/admin/forgot-password");
    }
    if (code.length !== 6) return toast.error("Enter the 6-digit code");
    try {
      setLoading(true);
      const res = await verifyResetCode({ email, code });
      toast.success(res.data.message);
      navigate("/admin/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell subtitle={`Enter the 6-digit code sent to ${email || "your email"}`}>
      <div className="mb-6"><BackLink to="/admin/forgot-password" label="Back" /></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput inputMode="numeric" maxLength={6} placeholder="6-Digit Code" value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} required />
        <AuthButton loading={loading}>Verify Code</AuthButton>
      </form>
    </AuthShell>
  );
};

export default VerifyResetCodePage;