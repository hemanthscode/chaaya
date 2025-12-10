// src/components/common/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-slate-950">
      {/* Animated background gradient */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-slate-950 to-slate-950"
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-xs backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span className="text-brand-300">Portfolio 2024–2025</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl font-bold leading-[1.1] tracking-tight text-slate-50 md:text-6xl lg:text-7xl"
              >
                Where Light
                <br />
                <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Meets Story
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-xl text-lg leading-relaxed text-slate-300"
              >
                Capturing the raw, unscripted moments that define who we are. 
                From intimate portraits to grand celebrations—every frame tells a story worth preserving.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="group">
                <Link to="/gallery" className="flex items-center gap-2">
                  Explore Gallery
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Book Your Session</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-4 text-sm"
            >
              <div>
                <p className="text-2xl font-bold text-slate-50">500+</p>
                <p className="text-slate-400">Images Curated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">100+</p>
                <p className="text-slate-400">Sessions Captured</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">50+</p>
                <p className="text-slate-400">Happy Clients</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Image Mosaic */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[600px]">
              {/* Large image */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 top-0 h-[380px] w-[280px] overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
              >
                <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/40 via-purple-500/20 to-transparent" />
              </motion.div>

              {/* Medium image - top right */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: 2 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 top-8 h-[240px] w-[200px] overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl"
              >
                <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/30 via-transparent to-transparent" />
              </motion.div>

              {/* Small image - bottom right */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: -2 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 right-12 h-[200px] w-[180px] overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl"
              >
                <div className="h-full w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-8 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-medium text-slate-100 shadow-lg backdrop-blur-md"
              >
                ✨ Featured Work
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500">Scroll to explore</span>
          <div className="h-6 w-4 rounded-full border-2 border-slate-700">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-brand-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
