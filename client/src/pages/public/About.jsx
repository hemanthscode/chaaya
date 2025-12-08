/**
 * About Page
 * About the photographer
 */

import React from 'react';
import { IoCamera, IoMail, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';
import Container from '@components/layout/Container';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const skills = [
    'Portrait Photography',
    'Landscape Photography',
    'Event Photography',
    'Product Photography',
    'Photo Editing',
    'Studio Lighting',
    'Adobe Photoshop',
    'Adobe Lightroom',
  ];

  const achievements = [
    {
      year: '2024',
      title: 'International Photography Award',
      description: 'Winner in the Landscape category',
    },
    {
      year: '2023',
      title: 'Photography Magazine Feature',
      description: 'Featured article on modern photography techniques',
    },
    {
      year: '2022',
      title: 'Exhibition at City Gallery',
      description: 'Solo exhibition showcasing urban photography',
    },
  ];

  return (
    <div className="py-8">
      <Container>
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="aspect-[3/4] rounded-lg overflow-hidden">
            <img
              src="/about-photo.jpg"
              alt="Photographer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800?text=Photographer';
              }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Hello, I'm Chaya
            </h1>
            <p className="text-xl text-primary-600 dark:text-primary-400 mb-6">
              Professional Photographer & Visual Storyteller
            </p>

            <div className="space-y-4 text-gray-600 dark:text-gray-400 mb-8">
              <p>
                With over 10 years of experience in photography, I specialize in capturing 
                authentic moments that tell compelling stories. My work spans across various 
                genres including portrait, landscape, and event photography.
              </p>
              <p>
                I believe that every photograph should evoke emotion and create a lasting 
                impression. Whether it's the subtle play of light in a landscape or the 
                candid expression of a subject, I strive to capture the essence of each moment.
              </p>
              <p>
                My approach combines technical expertise with artistic vision, resulting in 
                images that are both technically sound and emotionally resonant.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<IoMail />}
                onClick={() => navigate('/contact')}
              >
                Get in Touch
              </Button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <IoLogoInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <IoLogoTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Achievements & Recognition
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {achievement.year}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Portrait Sessions',
                description: 'Professional portrait photography for individuals and families',
              },
              {
                title: 'Event Coverage',
                description: 'Comprehensive coverage of weddings, corporate events, and special occasions',
              },
              {
                title: 'Commercial Photography',
                description: 'High-quality product and commercial photography for businesses',
              },
            ].map((service, index) => (
              <Card key={index} className="text-center">
                <IoCamera className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="text-center bg-gradient-to-r from-primary-600 to-secondary-600">
            <h2 className="text-3xl font-bold text-white mb-4">
              Let's Work Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Interested in collaborating or booking a session? I'd love to hear about your project.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Contact Me
            </Button>
          </Card>
        </section>
      </Container>
    </div>
  );
};

export default About;
