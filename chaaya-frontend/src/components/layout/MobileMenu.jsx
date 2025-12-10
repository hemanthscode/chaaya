import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const MobileMenu = ({ onClose }) => {
  const { user } = useAuth();

  return (
    <div className="border-t border-slate-800 bg-slate-950 px-4 pb-4 pt-2">
      <div className="flex flex-col gap-2 text-sm">
        <NavLink to="/" onClick={onClose} className="py-1 text-slate-200">
          Home
        </NavLink>
        <NavLink to="/gallery" onClick={onClose} className="py-1 text-slate-200">
          Gallery
        </NavLink>
        <NavLink to="/series" onClick={onClose} className="py-1 text-slate-200">
          Series
        </NavLink>
        <NavLink to="/about" onClick={onClose} className="py-1 text-slate-200">
          About
        </NavLink>
        <NavLink to="/contact" onClick={onClose} className="py-1 text-slate-200">
          Contact
        </NavLink>

        {user && (
          <>
            <NavLink to="/favorites" onClick={onClose} className="py-1 text-slate-200">
              Favorites
            </NavLink>
            <NavLink to="/profile" onClick={onClose} className="py-1 text-slate-200">
              Profile
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" onClick={onClose} className="py-1 text-brand-400">
                Admin
              </NavLink>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
