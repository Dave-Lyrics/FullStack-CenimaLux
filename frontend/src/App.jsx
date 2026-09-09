import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import PaymentSuccessPage from "./pages/public/PaymentSuccessPage";
import MyTicketsPage from "./pages/public/MyTicketsPage";

import SignupPage from "./pages/admin/SignupPage";
import LoginPage from "./pages/admin/LoginPage";
import ForgotPasswordPage from "./pages/admin/ForgotPasswordPage";
import VerifyResetCodePage from "./pages/admin/VerifyResetCodePage";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";
import DashboardPage from "./pages/admin/DashboardPage";
import MoviesPage from "./pages/admin/MoviesPage";
import ShowtimesPage from "./pages/admin/ShowtimesPage";
import BookingsPage from "./pages/admin/BookingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/signup" element={<SignupPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/verify-reset-code" element={<VerifyResetCodePage />} />
        <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

        {/* Protected admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="showtimes" element={<ShowtimesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;