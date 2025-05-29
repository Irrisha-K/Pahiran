// components/ProtectedRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const authCtx = useContext(AuthContext);

  if (!authCtx.isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (roles.length > 0 && !roles.includes(authCtx.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
