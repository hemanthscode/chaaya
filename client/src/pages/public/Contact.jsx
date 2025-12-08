/**
 * Contact Page
 * Contact form and information
 */

import React from 'react';
import { IoMail, IoCall, IoLocation, IoLogoInstagram, IoLogoTwitter, IoLogoFacebook } from 'react-icons/io5';
import Container from '@components/layout/Container';
import ContactForm from '@components/contact/ContactForm';
import Card from '@components/common/Card';

const Contact = () => {
  const contactInfo = [
    {
      icon: IoMail,
      label: 'Email',
      value: 'hello@chaya.com',
      href: 'mailto:hello@chaya.com',
    },
    {
      icon: IoCall,
      label: 'Phone',
      value: '+1 (234) 567-890',
      href: 'tel:+1234567890',
    },
    {
      icon: IoLocation,
      label: 'Location',
      value: '123 Photography St, City, Country',
      href: null,
    },
  ];

  const socialLinks = [
    { icon: IoLogoInstagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: IoLogoTwitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: IoLogoFacebook, label: 'Facebook', href: 'https://facebook.com' },
  ];

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start space-x-3">
                    <info.icon className="flex-shrink-0 text-primary-600 dark:text-primary-400 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Media */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Follow Me
              </h3>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </Card>

            {/* Business Hours */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                  <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                  <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Map Section (Optional) */}
        <section className="mt-12">
          <Card padding={false}>
            <div className="aspect-[21/9] bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
              {/* Replace with actual map integration if needed */}
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                Map placeholder - Integrate Google Maps or similar service
              </div>
            </div>
          </Card>
        </section>
      </Container>
    </div>
  );
};

export default Contact;
