/**
 * Footer Component
 * Site footer with links and info
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoLinkedin,
  IoMail,
  IoCall,
  IoLocation,
} from 'react-icons/io5';
import Container from './Container';
import { APP_NAME } from '@utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    portfolio: [
      { to: '/portfolio', label: 'All Images' },
      { to: '/series', label: 'Series' },
      { to: '/portfolio/portrait', label: 'Portrait' },
      { to: '/portfolio/landscape', label: 'Landscape' },
    ],
    company: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/services', label: 'Services' },
      { to: '/pricing', label: 'Pricing' },
    ],
    legal: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
      { to: '/cookies', label: 'Cookie Policy' },
    ],
  };

  const socialLinks = [
    { icon: IoLogoInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: IoLogoTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: IoLogoFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: IoLogoLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 mt-20">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">
                {APP_NAME}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Capturing moments, creating memories. Professional photography services for all occasions.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Portfolio
              </h4>
              <ul className="space-y-2">
                {footerLinks.portfolio.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                  <IoLocation className="flex-shrink-0 mt-1" />
                  <span>123 Photography St, City, Country</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <IoMail className="flex-shrink-0" />
                  <a href="mailto:hello@chaya.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    hello@chaya.com
                  </a>
                </li>
                <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <IoCall className="flex-shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-200 dark:border-dark-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
