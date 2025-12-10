// src/pages/admin/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsDashboard } from '../services/admin.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Image as ImageIcon, Layers, Mail, Eye, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchAnalyticsDashboard
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6">
          <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-center">
            <p className="text-sm text-red-400">Failed to load dashboard</p>
          </div>
        </main>
      </div>
    );
  }

  const stats = data?.stats || {};
  const images = stats.images || { total: 0, published: 0, draft: 0 };
  const popularImages = stats.popularImages || [];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 text-sm">
        {/* Header */}
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-slate-50">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Overview of your portfolio performance and content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* Total Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Images
                </CardTitle>
                <ImageIcon className="h-4 w-4 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-50">
                  {images.total}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="text-green-400">{images.published} published</span>
                <span>•</span>
                <span className="text-amber-400">{images.draft} draft</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Series */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Series
                </CardTitle>
                <Layers className="h-4 w-4 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-50">
                {stats.series || 0}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Curated collections
              </p>
            </CardContent>
          </Card>

          {/* Unread Contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Messages
                </CardTitle>
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-50">
                {stats.unreadContacts || 0}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {stats.unreadContacts > 0 ? (
                  <span className="text-amber-400">Needs attention</span>
                ) : (
                  'All caught up'
                )}
              </p>
            </CardContent>
          </Card>

          {/* Total Engagement */}
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
                {popularImages.reduce((sum, img) => sum + (img.views || 0), 0)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Across all images
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Images */}
        {popularImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-50">
                Popular Images
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                Most viewed images in your portfolio
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularImages.map((img, index) => (
                  <div
                    key={img._id}
                    className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-slate-700"
                  >
                    {/* Rank */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-400">
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-slate-800">
                      <img
                        src={img.thumbnailUrl}
                        alt={img.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <Link
                        to={`/image/${img._id}`}
                        className="text-sm font-medium text-slate-100 hover:text-brand-400"
                      >
                        {img.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {img.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {img.likes || 0} likes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-50">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Link
                to="/admin/upload"
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-brand-500 hover:bg-slate-900"
              >
                <ImageIcon className="h-5 w-5 text-brand-400" />
                <div>
                  <p className="text-sm font-medium text-slate-100">Upload Images</p>
                  <p className="text-xs text-slate-500">Add new photos</p>
                </div>
              </Link>

              <Link
                to="/admin/series"
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-brand-500 hover:bg-slate-900"
              >
                <Layers className="h-5 w-5 text-brand-400" />
                <div>
                  <p className="text-sm font-medium text-slate-100">Manage Series</p>
                  <p className="text-xs text-slate-500">Organize collections</p>
                </div>
              </Link>

              <Link
                to="/admin/contacts"
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-brand-500 hover:bg-slate-900"
              >
                <Mail className="h-5 w-5 text-brand-400" />
                <div>
                  <p className="text-sm font-medium text-slate-100">View Messages</p>
                  <p className="text-xs text-slate-500">Check inquiries</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
