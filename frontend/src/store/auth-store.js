import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, name, role = "developer", apiKey = null) => {
    set({ isLoading: true, error: null });

    const config = apiKey ? { headers: { "x-api-key": apiKey } } : {};

    try {
      const respose = await axios.post(
        `${API_URL}/signup`,
        {
          email,
          password,
          name,
          role,
        },
        config
      );
      set({ user: respose.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.log(error.message);
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
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
      });
      console.log("user: verified => ", get().user);
      return response.data;
    } catch (error) {
      console.log(error);
      set({
        error: error.response?.data?.message || "Error verifying Email",
        isLoading: false,
      });

      console.log("state after error", get());
      throw error;
    }
  },

  resendOtp: async () => {
    try {
      set({ isLoading: true, error: null }); // Reset error state when starting

      const response = await axios.post(`${API_URL}/resend-otp`, {
        email: get().user?.email, // Safely access email
      });

      // Only update state if request was successful
      set({
        isLoading: false,
        error: null,
      });

      return response.data; // Return the response data for potential use
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP";

      set({
        isLoading: false,
        error: errorMessage,
      });

      // Returning the error instead of throwing if we want callers to handle it
      //return { error: errorMessage };

      //OR if we prefer throwing:
      throw new Error(errorMessage);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/check-auth`);

      set({
        user: response.data.message,
        isCheckingAuth: false,
        isAuthenticated: true,
      });
      return response;
    } catch (error) {
      console.error("checkAuth error:", error);

      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "error loging in",
        isLoading: false,
      });
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
      });
    } catch (error) {
      set({
        isAuthenticated: true,
        isLoading: false,
        error: error.data.message,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      console.log("response forgot-password : ", response);
      set({ isLoading: false });
    } catch (error) {
      console.error("react ! ", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "error reseting password ",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "error resetting password ",
      });
      throw error;
    }
  },
}));
