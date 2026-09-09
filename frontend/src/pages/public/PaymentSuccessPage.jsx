import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyPayment } from "../../api/paymentApi";
import Ticket from "../../components/Ticket";
import { Loader2, XCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [state, setState] = useState({ status: "verifying", booking: null, error: "" });

  useEffect(() => {
    const run = async () => {
      if (!reference) {
        setState({ status: "error", booking: null, error: "No payment reference found." });
        return;
      }
      try {
        const res = await verifyPayment(reference);
        setState({ status: "done", booking: res.data.booking, error: "" });
      } catch (error) {
        setState({
          status: "error",
          booking: null,
          error: error.response?.data?.error || "Could not verify your payment.",
        });
      }
    };
    run();
  }, [reference]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {state.status === "verifying" && (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
          <p className="text-gray-400">Confirming your payment and reserving your seats...</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="text-center space-y-4 max-w-md">
          <XCircle className="w-14 h-14 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Payment Issue</h2>
          <p className="text-gray-400 text-sm">{state.error}</p>
          <Link to="/" className="inline-block bg-gold text-black font-semibold px-6 py-2.5 rounded-xl">
            Back to Movies
          </Link>
        </div>
      )}

      {state.status === "done" && state.booking && (
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gold mb-2">Payment Confirmed!</h1>
            <p className="text-gray-400 text-sm">
              Your seats {state.booking.seats.join(", ")} are locked in. An email copy is on its way to {state.booking.email}.
            </p>
          </div>
          <Ticket booking={state.booking} />
          <p className="text-center mt-6">
            <Link to="/my-tickets" className="text-gold text-sm hover:underline">
              View all my tickets &rarr;
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;