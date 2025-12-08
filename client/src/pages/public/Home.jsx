/**
 * Home Page
 * Landing page with featured content
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward, IoImages } from 'react-icons/io5';
import * as imageService from '@services/imageService';
import * as seriesService from '@services/seriesService';
import Container from '@components/layout/Container';
import FeaturedSlider from '@components/portfolio/FeaturedSlider';
import ImageGrid from '@components/portfolio/ImageGrid';
import SeriesGrid from '@components/series/SeriesGrid';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';

const Home = () => {
  const [featuredImages, setFeaturedImages] = useState([]);
  const [recentImages, setRecentImages] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [imagesRes, seriesRes] = await Promise.all([
          imageService.getAll({ featured: true, limit: 6 }),
          seriesService.getAll({ featured: true, limit: 3 }),
        ]);

        // Get featured images for slider
        const featured = imagesRes.images?.filter(img => img.featured).slice(0, 5) || [];
        setFeaturedImages(featured);

        // Get recent images
        const recent = imagesRes.images?.slice(0, 12) || [];
        setRecentImages(recent);

        // Get featured series
        setFeaturedSeries(seriesRes.series || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  return (
    <div>
      {/* Hero Section with Featured Slider */}
      {featuredImages.length > 0 && (
        <section className="mb-16">
          <Container>
            <FeaturedSlider images={featuredImages} />
          </Container>
        </section>
      )}

      {/* Welcome Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Capturing Life's Beautiful Moments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Welcome to my photography portfolio. Explore a collection of carefully curated images 
              that tell stories through light, composition, and emotion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<IoArrowForward />}
                onClick={() => navigate('/portfolio')}
              >
                View Portfolio
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Recent Images */}
      <section className="py-16">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Recent Work
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Latest additions to the portfolio
              </p>
            </div>
            <Button
              variant="ghost"
              rightIcon={<IoArrowForward />}
              onClick={() => navigate('/portfolio')}
            >
              View All
            </Button>
          </div>

          <ImageGrid images={recentImages} />
        </Container>
      </section>

      {/* Featured Series */}
      {featuredSeries.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-dark-800">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Featured Series
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Curated collections of themed photography
                </p>
              </div>
              <Button
                variant="ghost"
                rightIcon={<IoArrowForward />}
                onClick={() => navigate('/series')}
              >
                View All
              </Button>
            </div>

            <SeriesGrid series={featuredSeries} />
          </Container>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16">
        <Container>
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center">
            <IoImages className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Whether you need professional photography services or want to collaborate on a creative project, 
              I'd love to hear from you.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Contact Me
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
