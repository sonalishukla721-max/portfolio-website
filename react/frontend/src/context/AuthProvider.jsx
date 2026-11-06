import { useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import AuthContext from "./authContextValue";
const STORAGE_KEY = "portfolio-admin-token";

function getTokenClaims(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function getStoredToken() {
  const token = window.localStorage.getItem(STORAGE_KEY);
  return token && getTokenClaims(token) ? token : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);
  const claims = token ? getTokenClaims(token) : null;
  const isAdmin = claims?.role === "admin";

  async function login(email, password) {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const tokenClaims = result?.token && getTokenClaims(result.token);
    if (!tokenClaims) {
      throw new Error("The login response did not contain a valid session token.");
    }
    if (tokenClaims.role !== "admin") {
      throw new Error("This account does not have administrator access.");
    }

    window.localStorage.setItem(STORAGE_KEY, result.token);
    setToken(result.token);
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  const value = useMemo(() => ({ token, isAdmin, login, logout }), [token, isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
