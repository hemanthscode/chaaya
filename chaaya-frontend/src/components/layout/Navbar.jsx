import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/series', label: 'Series' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

const Navbar = () => {
  return (
    <nav className="flex items-center gap-4 text-sm">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `transition-colors ${
              isActive ? 'text-brand-400' : 'text-slate-300 hover:text-brand-300'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
