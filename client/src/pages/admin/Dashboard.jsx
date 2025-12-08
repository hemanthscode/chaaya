/**
 * Dashboard Page
 * Admin dashboard with overview
 */

import React, { useState, useEffect } from 'react';
import * as analyticsService from '@services/analyticsService';
import Container from '@components/layout/Container';
import DashboardStats from '@components/admin/DashboardStats';
import AnalyticsChart from '@components/admin/AnalyticsChart';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use getDashboard instead of getStats
      const response = await analyticsService.getDashboard();
      setStats(response.data || response);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} fullScreen />;
  }

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12">
          <DashboardStats stats={stats} />
        </div>

        {/* Analytics Charts */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stats.viewsChart && (
              <AnalyticsChart
                title="Views (Last 7 Days)"
                data={stats.viewsChart}
                dataKey="views"
              />
            )}
            {stats.likesChart && (
              <AnalyticsChart
                title="Likes (Last 7 Days)"
                data={stats.likesChart}
                dataKey="likes"
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
