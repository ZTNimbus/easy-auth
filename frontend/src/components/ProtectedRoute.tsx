import { PropsWithChildren } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.isVerified) return <Navigate to="verify-email" replace />;

  return children;
}

export default ProtectedRoute;
