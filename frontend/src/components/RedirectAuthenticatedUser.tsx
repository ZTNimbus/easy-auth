import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function RedirectAuthenticatedUser({ children }: PropsWithChildren) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;

  return children;
}

export default RedirectAuthenticatedUser;
