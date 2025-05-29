// components/AuthRedirect.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";

export default function AuthRedirect({ children }) {
  const authCtx = useContext(AuthContext);

  return authCtx.isLoggedIn ? <Navigate to="/" replace /> : children;
}
