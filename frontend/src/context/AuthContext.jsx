// context/AuthContext.jsx
// Global authentication state — provides user, login, logout, and loading

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('stylehub_token');
    const storedUser = localStorage.getItem('stylehub_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = (token, userData) => {
    localStorage.setItem('stylehub_token', token);
    localStorage.setItem('stylehub_user', JSON.stringify(userData));
    setUser(userData);
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('stylehub_token');
    localStorage.removeItem('stylehub_user');
    setUser(null);
  };

  // ─── Update User Profile ─────────────────────────────────────────────────────
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('stylehub_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
