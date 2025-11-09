// AUTHENTICATION CONTEXT

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set authorization header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user profile
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data.data);
        } catch (error) {
          console.error("Failed to load user:", error);
          // Invalid token - clear it
          localStorage.removeItem("token");
          setToken(null);
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register new user
  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    const { token: newToken, ...userData } = response.data.data;

    // Save token to localStorage
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    // Set user data
    setUser(userData);

    return response.data;
  };

  // Login user
  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token: newToken, ...userData } = response.data.data;

    // Save token to localStorage
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    // Set user data
    setUser(userData);

    return response.data;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};