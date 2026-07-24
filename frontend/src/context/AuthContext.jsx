import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dispatch_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dispatch_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getMeApi();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('dispatch_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('dispatch_token', data.token);
      localStorage.setItem('dispatch_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    // 1. Register user
    await registerApi(userData);
    // 2. Auto-login immediately
    return await login({
      email: userData.email,
      password: userData.password,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dispatch_token');
    localStorage.removeItem('dispatch_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
