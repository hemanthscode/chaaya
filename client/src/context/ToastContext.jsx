/**
 * Toast Context
 * Wrapper for react-hot-toast with custom configuration
 */

import React, { createContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { TOAST_CONFIG } from '@utils/constants';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={{}}>
      {children}
      <Toaster
        position={TOAST_CONFIG.position}
        toastOptions={{
          duration: TOAST_CONFIG.duration,
          style: TOAST_CONFIG.style,
          success: TOAST_CONFIG.success,
          error: TOAST_CONFIG.error,
        }}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
