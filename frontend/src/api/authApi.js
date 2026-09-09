import api from "../lib/axios";

export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const verifyResetCode = (data) => api.post("/auth/verify-reset-code", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);