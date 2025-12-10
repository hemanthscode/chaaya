import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import Navbar from './Navbar.jsx';
import MobileMenu from './MobileMenu.jsx';
import Button from '../ui/Button.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-brand-500" />
          <span className="font-semibold tracking-wide">Chaaya</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Navbar />
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-700 p-2 hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <NavLink
                to="/favorites"
                className="text-sm text-slate-200 hover:text-brand-400"
              >
                Favorites
              </NavLink>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className="text-sm text-brand-400 hover:text-brand-300"
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/profile"
                className="text-sm text-slate-200 hover:text-brand-400"
              >
                {user.name}
              </NavLink>
              <Button size="sm" variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm text-slate-200 hover:text-brand-400"
              >
                Login
              </NavLink>
              <Button asChild size="sm">
                <NavLink to="/register">Sign up</NavLink>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-700 p-2 hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-full border border-slate-700 p-2 hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        className="overflow-hidden md:hidden"
      >
        <MobileMenu onClose={() => setMobileOpen(false)} />
      </motion.div>
    </header>
  );
};

export default Header;
