import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Chaaya Photography. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-brand-300">
            About
          </Link>
          <Link to="/contact" className="hover:text-brand-300">
            Contact
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
