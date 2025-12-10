import React from 'react';
import { useFavorites } from '../hooks/useFavorites.js';
import ImageGrid from '../components/ui/ImageGrid.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Favorites = () => {
  const { data, isLoading } = useFavorites();

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
      <h1 className="mb-4 text-xl font-semibold text-slate-50">My favorites</h1>
      <ImageGrid images={data || []} />
    </section>
  );
};

export default Favorites;
