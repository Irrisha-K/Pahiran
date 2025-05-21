import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../store/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth.isLoggedIn || auth.role !== "admin") {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedAdminRoute;
