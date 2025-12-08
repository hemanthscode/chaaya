/**
 * Sidebar Component
 * Admin panel sidebar navigation
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  IoHome,
  IoImages,
  IoAlbums,
  IoFolder,
  IoMail,
  IoAnalytics,
  IoClose,
} from 'react-icons/io5';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/admin',
      icon: IoHome,
      label: 'Dashboard',
      end: true,
    },
    {
      to: '/admin/images',
      icon: IoImages,
      label: 'Images',
    },
    {
      to: '/admin/series',
      icon: IoAlbums,
      label: 'Series',
    },
    {
      to: '/admin/categories',
      icon: IoFolder,
      label: 'Categories',
    },
    {
      to: '/admin/contacts',
      icon: IoMail,
      label: 'Contacts',
    },
    {
      to: '/admin/analytics',
      icon: IoAnalytics,
      label: 'Analytics',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-screen transition-transform lg:translate-x-0',
          'w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
            <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-600 dark:text-gray-300"
              aria-label="Close sidebar"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                      )
                    }
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Chaya Admin v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
