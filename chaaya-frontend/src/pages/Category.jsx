import React from 'react';
import { useParams } from 'react-router-dom';
import { useCategoryDetail } from '../hooks/useCategories.js';
import { useImages } from '../hooks/useImages.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ImageGrid from '../components/ui/ImageGrid.jsx';

const Category = () => {
  const { slug } = useParams();
  const { data: category, isLoading } = useCategoryDetail(slug);
  const { data: imagesData } = useImages({ category: slug, limit: 100 });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">{category?.name}</h1>
      {category?.description && (
        <p className="mb-4 max-w-2xl text-slate-300">{category.description}</p>
      )}
      <ImageGrid images={imagesData?.items || []} />
    </section>
  );
};

export default Category;
