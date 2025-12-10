import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth.js';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Gallery from './pages/Gallery.jsx';
import Series from './pages/Series.jsx';
import SeriesDetail from './pages/SeriesDetail.jsx';
import Category from './pages/Category.jsx';
import ImageDetail from './pages/ImageDetail.jsx';
import Favorites from './pages/Favorites.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Contacts from './pages/Contacts.jsx';
import ImagesAdmin from './pages/ImagesAdmin.jsx';
import SeriesAdmin from './pages/SeriesAdmin.jsx';
import CategoriesAdmin from './pages/CategoriesAdmin.jsx';
import TestimonialsAdmin from './pages/TestimonialsAdmin.jsx';
import UploadAdmin from './pages/UploadAdmin.jsx';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/image/:id" element={<ImageDetail />} />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
          <Route path="/admin/contacts" element={<AdminRoute><Contacts /></AdminRoute>} />
          <Route path="/admin/images" element={<AdminRoute><ImagesAdmin /></AdminRoute>} />
          <Route path="/admin/series" element={<AdminRoute><SeriesAdmin /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoriesAdmin /></AdminRoute>} />
          <Route path="/admin/testimonials" element={<AdminRoute><TestimonialsAdmin /></AdminRoute>} />
          <Route path="/admin/upload" element={<AdminRoute><UploadAdmin /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
