"use client";
/**
 * @file Contexto de autenticación global.
 * @description Provee sesión (JWT), login, registro, Google y logout.
 * Redirige a /login si la API responde 401. Consumido por layout y páginas protegidas.
 */
import { createContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import axios from 'axios'; // Interceptor global para detectar sesión expirada

/** Contexto React; valor: { user, loading, login, register, ... } */
export const AuthContext = createContext();

/** Unifica _id/id del usuario y adjunta el token para el cliente API. */
function normalizeUser(raw, token) {
  if (!raw) return null;
  const id = raw._id ?? raw.id;
  return { ...raw, _id: id, id, token };
}

/** Envuelve la app y expone métodos de sesión a los hijos. */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Borra token local y limpia el estado de usuario. */
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  useEffect(() => {
    // Interceptor: ante 401 redirige a login (sesión expirada)
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

    // Al montar: si hay token en localStorage, recupera perfil con /auth/me
    const loadUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(normalizeUser(res.data, token));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  /** Inicio de sesión con email y contraseña; persiste token. */
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
       throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  };

  /** Registro de cuenta nueva; deja al usuario logueado. */
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
        throw error.response?.data?.message || 'Error al registrarse';
    }
  };

  /** Autenticación con credencial de Google (One Tap / botón). */
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
      throw error.response?.data?.message || 'Error con Google Login';
    }
  };

  /** Recarga datos del perfil tras editar Mis Datos. */
  const refreshUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      setUser(normalizeUser(res.data, token));
    } catch {
      logout();
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
