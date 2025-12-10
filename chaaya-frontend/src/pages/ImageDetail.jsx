// src/pages/ImageDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useImageDetail } from '../hooks/useImages.js';
import { useQuery } from '@tanstack/react-query';
import { fetchRelatedImages } from '../services/portfolio.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ImageGrid from '../components/ui/ImageGrid.jsx';

const ImageDetail = () => {
  const { id } = useParams();
  const { data: image, isLoading } = useImageDetail(id);

  const { data: related } = useQuery({
    queryKey: ['portfolio', 'related', id],
    queryFn: () => fetchRelatedImages(id),
    enabled: !!id
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!image) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-300">
        Image not found.
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 py-8 text-sm">
        <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
          <img
            src={image.cloudinaryUrl || image.thumbnailUrl}
            alt={image.title}
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="mb-1 text-xl font-semibold text-slate-50">
          {image.title || 'Untitled'}
        </h1>
        {image.description && (
          <p className="mb-2 text-slate-300">{image.description}</p>
        )}
        {image.category?.name && (
          <p className="text-xs text-slate-400">Category: {image.category.name}</p>
        )}
      </section>

      {related?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10 text-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-100">
            Related images
          </h2>
          <ImageGrid images={related} />
        </section>
      )}
    </>
  );
};

export default ImageDetail;
