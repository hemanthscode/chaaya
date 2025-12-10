import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Camera, ImageIcon, Layers, List, MessageCircle, Upload } from 'lucide-react';

const adminLinks = [
  { to: '/admin', icon: BarChart3, label: 'Dashboard' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/images', icon: ImageIcon, label: 'Images' },
  { to: '/admin/series', icon: Layers, label: 'Series' },
  { to: '/admin/categories', icon: List, label: 'Categories' },
  { to: '/admin/testimonials', icon: MessageCircle, label: 'Testimonials' },
  { to: '/admin/contacts', icon: MessageCircle, label: 'Contacts' },
  { to: '/admin/upload', icon: Upload, label: 'Upload' }
];

const Sidebar = () => {
  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-slate-800 bg-slate-950/80 p-4 md:block">
      <div className="mb-6 flex items-center gap-2">
        <Camera className="h-5 w-5 text-brand-500" />
        <span className="text-sm font-semibold text-slate-200">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {adminLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-brand-500/10 text-brand-300'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
