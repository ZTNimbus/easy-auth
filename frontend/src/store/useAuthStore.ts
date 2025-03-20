import axios from "axios";
import { create } from "zustand";

interface User {
  _id: string;
  email: string;
  password: string | null;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  updatedAt: Date;
}

interface useAuthStoreProps {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  message: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  signup: (email: string, password: string, name: string) => void;
  login: (email: string, password: string) => void;
  logout: VoidFunction;
  verifyEmail: (verificationCode: string) => void;
  checkAuth: VoidFunction;
  forgotPassword: (email: string) => void;
  resetPassword: (token: string, password: string) => void;
}

const API_URL =
  import.meta.env.NODE === "development"
    ? "http://localhost:3000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

function handleError(error: unknown, fallbackErrorMessage: string | null) {
  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.error ?? error.response?.data.message
    : fallbackErrorMessage;

  console.log(errorMessage);

  return errorMessage;
}

export const useAuthStore = create<useAuthStoreProps>((set) => {
  return {
    user: null,
    isAuthenticated: false,
    message: null,
    error: null,
    isLoading: false,
    isCheckingAuth: false,

    signup: async (email, password, name) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(`${API_URL}/signup`, {
          email,
          password,
          name,
        });

        const user = response.data.data as User;

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: unknown) {
        const errorMessage = handleError(error, "Error signing up");

        set({ isLoading: false, error: errorMessage });

        throw error;
      }
    },

    login: async (email, password) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });

        const user = response.data.data as User;

        set({ user, isAuthenticated: true, isLoading: false, error: null });
      } catch (error) {
        const errorMessage = handleError(error, "Error login");

        set({ isLoading: false, error: errorMessage });

        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });

      try {
        await axios.post(`${API_URL}/logout`);

        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        const errorMessage = handleError(error, "Error login");

        set({ isLoading: false, error: errorMessage });

        throw error;
      }
    },

    verifyEmail: async (verificationCode) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(`${API_URL}/verify-email`, {
          code: verificationCode,
        });

        const user = response.data.data as User;

        set({ user, isLoading: false });
      } catch (error) {
        const errorMessage = handleError(error, "Error verifying email");

        set({ isLoading: false, error: errorMessage });

        throw error;
      }
    },

    checkAuth: async () => {
      set({ isCheckingAuth: true, error: null });

      try {
        const response = await axios.get(`${API_URL}/check-auth`);

        const user = response.data.data as User;

        set({
          user,
          isCheckingAuth: false,
          isAuthenticated: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        //
        set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      }
    },

    forgotPassword: async (email) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(`${API_URL}/forgot-password`, {
          email,
        });

        set({ isLoading: false, message: response.data.message });
      } catch (error) {
        const errorMessage = handleError(
          error,
          "Error sending password reset email"
        );

        set({ isLoading: false, error: errorMessage });

        throw error;
      }
    },

    resetPassword: async (token, password) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(
          `${API_URL}/reset-password/${token}`,
          { password }
        );

        set({ isLoading: false, message: response.data.message });
      } catch (error) {
        const errorMessage = handleError(
          error,
          "Error sending password reset email"
        );

        set({ isLoading: false, error: errorMessage });

        throw error;
      }
    },
  };
});
