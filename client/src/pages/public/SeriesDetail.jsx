/**
 * SeriesDetail Page
 * Detailed series view with images
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import * as seriesService from '@services/seriesService';
import Container from '@components/layout/Container';
import SeriesDetail from '@components/series/SeriesDetail';
import ImageLightbox from '@components/portfolio/ImageLightbox';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';

const SeriesDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await seriesService.getBySlug(slug);
        setSeries(response.series);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [slug]);

  const handleImageClick = (image) => {
    const index = series.images.findIndex(img => img._id === image._id);
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => Math.min(series.images.length - 1, prev + 1));
  };

  if (loading) {
    return <Loader fullScreen text="Loading series..." />;
  }

  if (error || !series) {
    return (
      <ErrorMessage
        message={error || 'Series not found'}
        onRetry={() => window.location.reload()}
        fullScreen
      />
    );
  }

  return (
    <div className="py-8">
      <Container>
        {/* Back button */}
        <Button
          variant="ghost"
          leftIcon={<IoArrowBack />}
          onClick={() => navigate('/series')}
          className="mb-6"
        >
          Back to Series
        </Button>

        {/* Series Detail */}
        <SeriesDetail
          series={series}
          onImageClick={handleImageClick}
        />

        {/* Lightbox */}
        {series.images && series.images.length > 0 && (
          <ImageLightbox
            isOpen={lightboxOpen}
            image={series.images[selectedImageIndex]}
            images={series.images}
            currentIndex={selectedImageIndex}
            onClose={() => setLightboxOpen(false)}
            onPrevious={selectedImageIndex > 0 ? handlePrevious : null}
            onNext={selectedImageIndex < series.images.length - 1 ? handleNext : null}
          />
        )}
      </Container>
    </div>
  );
};

export default SeriesDetailPage;
