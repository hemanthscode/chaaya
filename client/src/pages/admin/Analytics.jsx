/**
 * Analytics Page
 * Detailed analytics and insights
 */

import React, { useState, useEffect } from 'react';
import * as analyticsService from '@services/analyticsService';
import Container from '@components/layout/Container';
import AnalyticsChart from '@components/admin/AnalyticsChart';
import Card from '@components/common/Card';
import Loader from '@components/common/Loader';
import { formatNumber } from '@utils/formatters';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Use getRecent instead of getAnalytics
        const response = await analyticsService.getRecent(days);
        setData(response.data || response);
      } catch (error) {
        console.error('Analytics error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  if (loading) {
    return <Loader fullScreen text="Loading analytics..." />;
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights and performance metrics
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  days === d
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                Last {d} days
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        {data?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.summary.totalViews || 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.summary.totalLikes || 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Images</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.summary.newImages || 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Engagement</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.summary.avgEngagement || '0'}%
              </p>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data?.viewsData && (
            <AnalyticsChart
              title="Daily Views"
              data={data.viewsData}
              dataKey="views"
            />
          )}
          {data?.likesData && (
            <AnalyticsChart
              title="Daily Likes"
              data={data.likesData}
              dataKey="likes"
            />
          )}
          {data?.topImages && (
            <AnalyticsChart
              title="Top Viewed Images"
              data={data.topImages}
              dataKey="views"
            />
          )}
          {data?.topCategories && (
            <AnalyticsChart
              title="Popular Categories"
              data={data.topCategories}
              dataKey="count"
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default Analytics;
