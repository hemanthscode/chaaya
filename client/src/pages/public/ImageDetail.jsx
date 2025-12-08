/**
 * ImageDetail Page
 * Detailed image view page
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IoHeart,
  IoHeartOutline,
  IoEye,
  IoDownload,
  IoShare,
  IoArrowBack,
  IoChevronBack,
  IoChevronForward,
} from 'react-icons/io5';
import * as imageService from '@services/imageService';
import Container from '@components/layout/Container';
import ImageMetadata from '@components/portfolio/ImageMetadata';
import ImageGrid from '@components/portfolio/ImageGrid';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';
import { formatNumber, formatDate } from '@utils/formatters';
import { isImageLiked, addLikedImage, removeLikedImage } from '@utils/storage';
import { useToast } from '@hooks/useToast';

const ImageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [image, setImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await imageService.getById(id);
        setImage(response.image);
        setLikes(response.image.likes || 0);
        setIsLiked(isImageLiked(id));

        // Fetch related images
        if (response.image.category) {
          const relatedRes = await imageService.getAll({
            category: response.image.category._id,
            limit: 6,
            exclude: id,
          });
          setRelatedImages(relatedRes.images || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    if (newLikedState) {
      addLikedImage(id);
    } else {
      removeLikedImage(id);
    }

    try {
      await imageService.like(id);
    } catch (error) {
      console.error('Like error:', error);
      // Revert on error
      setIsLiked(!newLikedState);
      setLikes(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading image..." />;
  }

  if (error || !image) {
    return (
      <ErrorMessage
        message={error || 'Image not found'}
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
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 dark:bg-dark-800 rounded-lg overflow-hidden">
              <img
                src={image.cloudinaryUrl}
                alt={image.title}
                className="w-full h-auto"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                >
                  {isLiked ? (
                    <IoHeart className="text-red-500" size={24} />
                  ) : (
                    <IoHeartOutline size={24} />
                  )}
                  <span className="font-medium">{formatNumber(likes)}</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <IoEye size={20} />
                  <span>{formatNumber(image.views)} views</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  leftIcon={<IoShare />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {image.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published {formatDate(image.createdAt)}
              </p>
            </div>

            {image.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {image.description}
                </p>
              </div>
            )}

            {image.category && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Category
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/portfolio/${image.category.slug}`)}
                >
                  {image.category.name}
                </Button>
              </div>
            )}

            {image.tags && image.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {image.metadata && (
              <ImageMetadata
                metadata={image.metadata}
                dateTaken={image.metadata.dateTaken}
              />
            )}

            {image.series && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Part of Series
                </h3>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/series/${image.series.slug}`)}
                >
                  {image.series.title}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Images */}
        {relatedImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Images
            </h2>
            <ImageGrid images={relatedImages} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default ImageDetail;
