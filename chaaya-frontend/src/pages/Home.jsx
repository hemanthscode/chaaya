// src/pages/Home.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../components/common/HeroSection.jsx';
import ImageGrid from '../components/ui/ImageGrid.jsx';
import SeriesCard from '../components/common/SeriesCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import { fetchHomepage } from '../services/portfolio.js';
import { fetchSeries } from '../services/series.js';
import { fetchTestimonials } from '../services/testimonials.js';
import { fetchRandomImages } from '../services/portfolio.js';
import { ArrowRight, Quote, Sparkles, TrendingUp } from 'lucide-react';

const Home = () => {
  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ['portfolio', 'home'],
    queryFn: fetchHomepage
  });

  const { data: seriesData, isLoading: seriesLoading } = useQuery({
    queryKey: ['series', { featured: true }],
    queryFn: () => fetchSeries({ featured: true, limit: 6 })
  });

  const { data: randomImages, isLoading: randomLoading } = useQuery({
    queryKey: ['portfolio', 'random', 12],
    queryFn: () => fetchRandomImages(12)
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials', { limit: 6 }],
    queryFn: () => fetchTestimonials(6)
  });

  const featuredImages = homeData?.featuredImages || [];
  const recentImages = homeData?.recentImages || [];
  const testimonials = testimonialsData || [];

  return (
    <div className="bg-slate-950">
      <HeroSection />

      {/* Featured Images Section */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span className="text-brand-300">Curated Selection</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-50 md:text-4xl">
              Featured Work
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              A handpicked collection of images that showcase the depth and diversity of stories captured through my lens.
            </p>
          </motion.div>

          {homeLoading ? (
            <LoadingSpinner />
          ) : (
            <ImageGrid images={featuredImages} />
          )}
        </div>
      </section>

      {/* Series Section */}
      <section className="relative overflow-hidden bg-slate-900/50 py-20">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-slate-50 md:text-4xl">
                  Curated Series
                </h2>
                <p className="max-w-xl text-slate-400">
                  Explore themed collections that weave individual moments into complete visual narratives.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/series" className="flex items-center gap-2">
                  View All Series
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {seriesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {seriesData?.items?.map((s) => (
                <SeriesCard key={s._id} series={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-xs">
                <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
                <span className="text-brand-300">Latest Updates</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-slate-50 md:text-4xl">
                Recent Captures
              </h2>
              <p className="max-w-xl text-slate-400">
                Fresh frames from the latest sessions and projects.
              </p>
            </div>
          </motion.div>

          {homeLoading ? (
            <LoadingSpinner />
          ) : (
            <ImageGrid images={recentImages} />
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials?.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-slate-50 md:text-4xl">
                Client Stories
              </h2>
              <p className="mx-auto max-w-2xl text-slate-400">
                Hear from the people who've trusted me to capture their most meaningful moments.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, index) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-brand-500/50"
                >
                  {/* Quote icon */}
                  <Quote className="mb-4 h-8 w-8 text-brand-500/20" />

                  {/* Content */}
                  <p className="mb-4 text-sm leading-relaxed text-slate-300">
                    "{t.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-sm font-semibold text-brand-400">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore More Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-50 md:text-4xl">
              Discover More
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              A rotating selection from across the entire portfolio—each refresh brings new stories to light.
            </p>
          </motion.div>

          {randomLoading ? (
            <LoadingSpinner />
          ) : (
            <ImageGrid images={randomImages || []} />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button asChild size="lg">
              <Link to="/gallery" className="flex items-center gap-2">
                View Full Gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-y border-slate-800 bg-slate-900/50 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-50 md:text-4xl">
              Ready to Tell Your Story?
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Whether it's a portrait session, wedding day, or creative project—let's create something timeless together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/contact">Book a Session</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More About Chaaya</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
