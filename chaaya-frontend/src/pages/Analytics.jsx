// src/pages/admin/Analytics.jsx
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsRecent, fetchAnalyticsRange } from '../services/admin.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const [viewMode, setViewMode] = useState('recent'); // 'recent' | 'range'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customDays, setCustomDays] = useState(7);

  // Recent analytics
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'recent', customDays],
    queryFn: () => fetchAnalyticsRecent(customDays),
    enabled: viewMode === 'recent'
  });

  // Range analytics
  const { data: rangeData, isLoading: rangeLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'range', startDate, endDate],
    queryFn: () => fetchAnalyticsRange(startDate, endDate),
    enabled: viewMode === 'range' && !!startDate && !!endDate
  });

  const isLoading = viewMode === 'recent' ? recentLoading : rangeLoading;
  const analytics = viewMode === 'recent' 
    ? recentData?.analytics || [] 
    : rangeData?.analytics || [];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 text-sm">
        {/* Header */}
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-slate-50">Analytics</h1>
          <p className="text-sm text-slate-400">
            Track views, engagement, and portfolio performance over time
          </p>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'recent' ? 'default' : 'outline'}
            onClick={() => setViewMode('recent')}
          >
            Recent Days
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'range' ? 'default' : 'outline'}
            onClick={() => setViewMode('range')}
          >
            Date Range
          </Button>
        </div>

        {/* Recent Days Controls */}
        {viewMode === 'recent' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-50">
                Time Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                {[7, 14, 30, 90].map((days) => (
                  <Button
                    key={days}
                    size="sm"
                    variant={customDays === days ? 'default' : 'outline'}
                    onClick={() => setCustomDays(days)}
                  >
                    Last {days} days
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Range Controls */}
        {viewMode === 'range' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-50">
                Custom Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : analytics.length === 0 ? (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="mb-3 h-12 w-12 text-slate-600" />
                <p className="text-sm text-slate-400">No analytics data available</p>
                <p className="mt-1 text-xs text-slate-500">
                  {viewMode === 'recent' 
                    ? `No activity recorded in the last ${customDays} days`
                    : 'No activity in the selected date range'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Total Views
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-slate-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-slate-50">
                    {analytics.reduce((sum, day) => sum + (day.views || 0), 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Avg. Daily Views
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-slate-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-slate-50">
                    {analytics.length > 0
                      ? Math.round(
                          analytics.reduce((sum, day) => sum + (day.views || 0), 0) /
                            analytics.length
                        )
                      : 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Peak Day
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-slate-50">
                    {Math.max(...analytics.map((day) => day.views || 0))}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">views</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-50">
                  Daily Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-3"
                    >
                      <span className="text-sm text-slate-300">{day.date}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">
                          {day.views || 0} views
                        </span>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full bg-brand-500 transition-all"
                            style={{
                              width: `${
                                (day.views /
                                  Math.max(...analytics.map((d) => d.views || 1))) *
                                100
                              }%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
