import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { loginRequest, registerRequest, getProfileRequest } from '../services/auth.js';
import { setAccessToken } from '../services/api.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'chaaya_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.user) {
          setUser(parsed.user);
          setAccessToken(parsed.token);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setBootstrapping(false);
  }, []);

  const saveAuth = useCallback((auth) => {
    if (!auth) {
      localStorage.removeItem(STORAGE_KEY);
      setAccessToken(null);
      setUser(null);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setAccessToken(auth.token);
    setUser(auth.user);
  }, []);

  const login = useCallback(async (email, password) => {
    const auth = await loginRequest(email, password);
    saveAuth(auth);
    toast.success('Welcome back!');
    return auth.user;
  }, [saveAuth]);

  const register = useCallback(async (payload) => {
    const auth = await registerRequest(payload);
    saveAuth(auth);
    toast.success('Account created!');
    return auth.user;
  }, [saveAuth]);

  const logout = useCallback(() => {
    saveAuth(null);
    toast.success('Logged out');
  }, [saveAuth]);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    const profile = await getProfileRequest();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      saveAuth({ ...parsed, user: profile });
    } else {
      setUser(profile);
    }
    return profile;
  }, [user, saveAuth]);

  const value = {
    user,
    isAuthenticated: !!user,
    bootstrapping,
    login,
    register,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
