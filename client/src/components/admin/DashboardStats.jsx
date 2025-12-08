/**
 * DashboardStats Component
 * Dashboard statistics cards
 */

import React from 'react';
import { IoImages, IoAlbums, IoFolder, IoEye, IoHeart, IoMail } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { formatNumber } from '@utils/formatters';
import Card from '@components/common/Card';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      icon: IoImages,
      label: 'Total Images',
      value: stats?.totalImages || 0,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: IoAlbums,
      label: 'Series',
      value: stats?.totalSeries || 0,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: IoFolder,
      label: 'Categories',
      value: stats?.totalCategories || 0,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: IoEye,
      label: 'Total Views',
      value: stats?.totalViews || 0,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: IoHeart,
      label: 'Total Likes',
      value: stats?.totalLikes || 0,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: IoMail,
      label: 'Unread Contacts',
      value: stats?.unreadContacts || 0,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(stat.value)}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
