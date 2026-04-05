import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Use a custom header to avoid cache if needed, but 304 is usually fine
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("AuthProvider mounted");
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const { token, ...userData } = res.data;
    setUser(userData);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    const { token, ...newUserData } = res.data;
    setUser(newUserData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
