/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '@services/authService';
import * as storage from '@utils/storage';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initAuth = () => {
      const storedToken = storage.getAuthToken();
      const storedUser = storage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token: newToken, user: newUser } = response;

      // Save to storage
      storage.setAuthToken(newToken);
      storage.setUser(newUser);

      // Update state
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      toast.success(SUCCESS_MESSAGES.LOGIN);
      
      // Redirect based on role
      if (newUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return { success: true, user: newUser };
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      return { success: false, error: error.message };
    }
  }, [navigate]);

  /**
   * Register new user
   */
  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: newUser } = response;

      // Save to storage
      storage.setAuthToken(newToken);
      storage.setUser(newUser);

      // Update state
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      toast.success(SUCCESS_MESSAGES.REGISTER);
      navigate('/');

      return { success: true, user: newUser };
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      return { success: false, error: error.message };
    }
  }, [navigate]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage
      storage.clearAuthData();

      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      toast.success(SUCCESS_MESSAGES.LOGOUT);
      navigate('/login');
    }
  }, [navigate]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.user;

      // Update storage and state
      storage.setUser(updatedUser);
      setUser(updatedUser);

      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
      return { success: true, user: updatedUser };
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success(SUCCESS_MESSAGES.PASSWORD_CHANGED);
      return { success: true };
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      const updatedUser = response.user;

      storage.setUser(updatedUser);
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
