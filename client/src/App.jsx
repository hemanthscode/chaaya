/**
 * Main App Component
 * Root component with providers and layout
 */

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import { ToastProvider } from '@context/ToastContext';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import Sidebar from '@components/layout/Sidebar';
import AppRoutes from '@routes/AppRoutes';
import { useAuth } from '@hooks/useAuth';
import { IoMenu } from 'react-icons/io5';

// Layout wrapper to access auth context
const AppLayout = () => {
  const { isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current route is admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900">
      {/* Admin Layout */}
      {isAdminRoute && isAdmin() ? (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
            {/* Admin Header */}
            <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 dark:text-gray-300"
                  aria-label="Open sidebar"
                >
                  <IoMenu size={24} />
                </button>
                <div className="flex-1 lg:ml-0 ml-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Admin Panel
                  </h2>
                </div>
              </div>
            </header>

            {/* Admin Content */}
            <main className="flex-1 overflow-y-auto">
              <AppRoutes />
            </main>
          </div>
        </div>
      ) : (
        // Public Layout
        <>
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
