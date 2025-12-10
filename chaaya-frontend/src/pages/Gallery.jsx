import React from 'react';
import { useState } from 'react';
import { useImages } from '../hooks/useImages.js';
import { useCategories } from '../hooks/useCategories.js';
import ImageGrid from '../components/ui/ImageGrid.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';

const Gallery = () => {
  const [page, setPage] = useState(1);
  const [categorySlug, setCategorySlug] = useState('all');

  const { data, isLoading, isFetching } = useImages({
    page,
    limit: 12,
    category: categorySlug === 'all' ? undefined : categorySlug
  });

  const { data: categories } = useCategories();

  const images = data?.items || [];
  const pagination = data?.pagination;

  const canNext = pagination?.page < pagination?.totalPages;
  const canPrev = pagination?.page > 1;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-slate-50">Gallery</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={categorySlug === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCategorySlug('all');
              setPage(1);
            }}
          >
            All
          </Button>
          {categories?.map((cat) => (
            <Button
              key={cat._id}
              variant={categorySlug === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCategorySlug(cat.slug);
                setPage(1);
              }}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <>
          <ImageGrid images={images} />
          {pagination && (
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <p>
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canPrev || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canNext || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Gallery;
