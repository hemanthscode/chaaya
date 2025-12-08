/**
 * useToast Hook
 * Wrapper for react-hot-toast
 */

import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, options);
  };

  const showError = (message, options = {}) => {
    toast.error(message, options);
  };

  const showInfo = (message, options = {}) => {
    toast(message, { icon: 'ℹ️', ...options });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, options);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    loading: showLoading,
    dismiss,
    dismissAll,
  };
};

export default useToast;
