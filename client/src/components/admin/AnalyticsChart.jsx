/**
 * AnalyticsChart Component
 * Simple analytics visualization
 */

import React from 'react';
import { formatDate, formatNumber } from '@utils/formatters';
import Card from '@components/common/Card';

const AnalyticsChart = ({ data = [], title, dataKey = 'value' }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No data available
        </p>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item[dataKey] || 0));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item[dataKey] / maxValue) * 100 : 0;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.date ? formatDate(item.date, 'MMM dd') : item.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(item[dataKey])}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AnalyticsChart;
