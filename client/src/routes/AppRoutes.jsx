/**
 * App Routes Configuration
 * Defines all application routes
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Loader from '@components/common/Loader';

// Lazy load pages
// Public pages
const Home = lazy(() => import('@pages/public/Home'));
const Portfolio = lazy(() => import('@pages/public/Portfolio'));
const PortfolioCategory = lazy(() => import('@pages/public/PortfolioCategory'));
const ImageDetail = lazy(() => import('@pages/public/ImageDetail'));
const SeriesList = lazy(() => import('@pages/public/SeriesList'));
const SeriesDetail = lazy(() => import('@pages/public/SeriesDetail'));
const About = lazy(() => import('@pages/public/About'));
const Contact = lazy(() => import('@pages/public/Contact'));
const Search = lazy(() => import('@pages/public/Search'));

// Auth pages
const Login = lazy(() => import('@pages/auth/Login'));
const Register = lazy(() => import('@pages/auth/Register'));
const Profile = lazy(() => import('@pages/auth/Profile'));

// Admin pages
const Dashboard = lazy(() => import('@pages/admin/Dashboard'));
const ManageImages = lazy(() => import('@pages/admin/ManageImages'));
const ManageSeries = lazy(() => import('@pages/admin/ManageSeries'));
const ManageCategories = lazy(() => import('@pages/admin/ManageCategories'));
const ManageContacts = lazy(() => import('@pages/admin/ManageContacts'));
const Analytics = lazy(() => import('@pages/admin/Analytics'));

// 404 page
const NotFound = lazy(() => import('@pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PublicRoute>
              <Portfolio />
            </PublicRoute>
          }
        />
        <Route
          path="/portfolio/:category"
          element={
            <PublicRoute>
              <PortfolioCategory />
            </PublicRoute>
          }
        />
        <Route
          path="/image/:id"
          element={
            <PublicRoute>
              <ImageDetail />
            </PublicRoute>
          }
        />
        <Route
          path="/series"
          element={
            <PublicRoute>
              <SeriesList />
            </PublicRoute>
          }
        />
        <Route
          path="/series/:slug"
          element={
            <PublicRoute>
              <SeriesDetail />
            </PublicRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PublicRoute>
              <About />
            </PublicRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PublicRoute>
              <Search />
            </PublicRoute>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute redirectIfAuthenticated>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute redirectIfAuthenticated>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/images"
          element={
            <AdminRoute>
              <ManageImages />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/series"
          element={
            <AdminRoute>
              <ManageSeries />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <AdminRoute>
              <ManageContacts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
