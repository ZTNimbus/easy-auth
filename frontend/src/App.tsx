import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import { Loader } from "lucide-react";

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-cyan-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-cyan-500"
        size="size-64"
        top="-5%"
        left="10%"
        delay={0}
      />

      <FloatingShape
        color="bg-blue-500"
        size="size-48"
        top="70%"
        left="80%"
        delay={5}
      />

      <FloatingShape
        color="bg-teal-500"
        size="size-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {isCheckingAuth && (
        <Loader className="animate-spin text-blue-950" size={100} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
