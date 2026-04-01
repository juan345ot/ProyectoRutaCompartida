"use client";
import { createContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import axios from 'axios'; // Still needed for interceptors if we apply them globally or to check error types

export const AuthContext = createContext();

function normalizeUser(raw, token) {
  if (!raw) return null;
  const id = raw._id ?? raw.id;
  return { ...raw, _id: id, id, token };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  useEffect(() => {
    // Setup axios interceptor for 401 redirect
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          // Optional: redirect to login if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
        return Promise.reject(error);
      }
    );

    // Check for token on load
    const loadUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(normalizeUser(res.data, token));
        } catch (error) {
          console.error("Auth Load Error", error);
        }
      }
      setLoading(false);
    };
    loadUser();

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token } = res.data;
      setUser(normalizeUser(userData, token));
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      return true;
    } catch (error) {
       console.error("Login Error", error);
       throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  };

  const register = async (userData) => {
    try {
        const res = await api.post('/auth/register', userData);
        const { user: newUser, token } = res.data;
        setUser(normalizeUser(newUser, token));
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        return true;
    } catch (error) {
        console.error("Register Error", error);
        throw error.response?.data?.message || 'Error al registrarse';
    }
  };

  const loginWithGoogle = async (googleData) => {
    try {
      const res = await api.post('/auth/google', googleData);
      const { user: userData, token } = res.data;
      setUser(normalizeUser(userData, token));
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      return true;
    } catch (error) {
      console.error("Google Login Error", error);
      throw error.response?.data?.message || 'Error con Google Login';
    }
  };

  const refreshUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      setUser(normalizeUser(res.data, token));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
