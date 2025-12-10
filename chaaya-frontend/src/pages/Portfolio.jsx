import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHomepage, fetchRandomImages } from '../services/portfolio.js';
import ImageGrid from '../components/ui/ImageGrid.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import SeriesCard from '../components/common/SeriesCard.jsx';
import { fetchSeries } from '../services/series.js';

const Portfolio = () => {
  const { data: home, isLoading } = useQuery({
    queryKey: ['portfolio', 'home'],
    queryFn: fetchHomepage
  });

  const { data: randomImages } = useQuery({
    queryKey: ['portfolio', 'random'],
    queryFn: () => fetchRandomImages(12)
  });

  const { data: seriesData } = useQuery({
    queryKey: ['series', { featured: true }],
    queryFn: () => fetchSeries({ featured: true, limit: 6 })
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">
        {home?.heroTitle || 'Portfolio'}
      </h1>
      {home?.heroSubtitle && (
        <p className="mb-6 max-w-2xl text-slate-300">{home.heroSubtitle}</p>
      )}

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-100">Signature work</h2>
        <ImageGrid images={home?.featuredImages || []} />
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-100">Curated series</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {seriesData?.items?.map((s) => (
            <SeriesCard key={s._id} series={s} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-100">Discover more</h2>
        <ImageGrid images={randomImages || []} />
      </div>
    </section>
  );
};

export default Portfolio;
