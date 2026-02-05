import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/dashboard";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  // --- AUTH STATE ---
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  requiresVerification: false,
  sessionExpiredNotified: false, 

  // --- APPS STATE ---
  apps: [],
  isLoadingApps: false,
  appError: null,

  // --- SETTERS ---
  setAuthError: (error) => set({ error }),
  setAppError: (appError) => set({ appError }),

  // --- AUTH METHODS ---
  signup: async (email, password, name, apiKey = null) => {
    set({ isLoading: true, error: null });

    const config = apiKey ? { headers: { "x-api-key": apiKey } } : {};

    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { email, password, name },
        config
      );

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response?.status === 409) set({ requiresVerification: true });

      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      if (error.response?.status === 403) set({ requiresVerification: true });

      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });

      console.error("Login error:", error);
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        requiresVerification: false,
      });

      console.log("User verified =>", get().user);
      return response.data;
    } catch (error) {
      console.error("Verify email error:", error);
      set({ error: "Error verifying email", isLoading: false });
      throw error;
    }
  },

  resendOtp: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/resend-otp`, {
        email: get().user?.email,
      });

      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      console.error("resendOtp error:", error);
      set({ isLoading: false, error: "Failed to resend OTP" });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response?.data?.user || null,
        isCheckingAuth: false,
        isAuthenticated: true,
        sessionExpiredNotified: false,
      });
      return response;
    } catch (error) {
      console.error("checkAuth error:", error);
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiredNotified: false,
      });
    } catch (error) {
      console.error("logout error:", error);
      set({ error: "Error logging out", isAuthenticated: true, isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false });
    } catch (error) {
      console.error("forgotPassword error:", error);
      set({ isLoading: false, error: "Error resetting password" });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ isLoading: false });
    } catch (error) {
      console.error("resetPassword error:", error);
      set({ isLoading: false, error: "Error resetting password" });
      throw error;
    }
  },

  refreshAccessToken: async () => {
    try {
      const response = await axios.get(`${API_URL}/refresh-token`);
      return response;
    } catch (error) {
      console.error("Refresh token failed", error);
      set({ user: null, isAuthenticated: false });
      throw error;
    }
  },

  // --- APPS METHODS ---
  getApps: async () => {
    set({ isLoadingApps: true, appError: null });

    try {
      const res = await axios.get(`${API_URL}/apps`, { withCredentials: true });
      set({ apps: res.data.apps, isLoadingApps: false });
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await get().refreshAccessToken();
          const retryRes = await axios.get(`${API_URL}/apps`, { withCredentials: true });
          set({ apps: retryRes.data.apps, isLoadingApps: false });
        } catch (refreshErr) {
          if (!get().sessionExpiredNotified) {
            set({ sessionExpiredNotified: true });
            toast.error("Session expired, user must log in again"); // keep for now
          }
          set({
            isAuthenticated: false,
            isLoadingApps: false,
            apps: [],
            appError: "Session expired. Please log in again.",
          });
          console.error(refreshErr);
        }
      } else {
        console.error("getApps error:", err);
        set({
          isLoadingApps: false,
          appError: err.response?.data?.message || "Internal server error",
        });
      }
    }
  },

  createApp: async (name) => {
    set({ isLoadingApps: true, appError: null });

    try {
      const res = await axios.post(
        `${API_URL}/apps/create-app`,
        { name },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      set((state) => ({
        apps: [...state.apps, res.data.app],
        isLoadingApps: false,
      }));

      console.log("App created, API key:", res.data.app.apiKey);
      return {newApp:{...res.data.app}, apiKey: res.data.apiKey};
    } catch (err) {
      set({ appError: err.response?.data?.message || "Internal server error", isLoadingApps: false });
      console.error("Create app error:", err);
      throw err;
    }
  },

  deleteApp: async (appId) => {
    set({ isLoadingApps: true, appError: null });

    try {
      await axios.delete(`${API_URL}/apps/${appId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      set((state) => ({
        apps: state.apps.filter((app) => app._id !== appId),
        isLoadingApps: false,
      }));

      console.log("App deleted successfully");
    } catch (err) {
      set({ appError: err.response?.data?.message || "Internal server error", isLoadingApps: false });
      console.error("Delete app error:", err);
      throw err;
    }
  },
}));
