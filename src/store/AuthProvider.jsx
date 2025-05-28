import React, { useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const login = useCallback((uid, token, role) => {
    setToken(token);
    setUserId(uid);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", uid);
    localStorage.setItem("role", role);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    // localStorage.removeItem("cart");
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.removeItem(`cart-${userId}`);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
