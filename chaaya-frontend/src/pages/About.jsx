// src/pages/About.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAboutPage } from '../services/portfolio.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Camera, Heart, Award, Users, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

const About = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', 'about'],
    queryFn: fetchAboutPage
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  // Fallback content if backend doesn't provide data
  const bio = data?.bio || `Photography, for me, isn't about freezing moments—it's about breathing life into them. Every frame I capture tells a story that words often fail to express. From the quiet vulnerability of a portrait to the unscripted joy of a wedding day, I seek the honest, fleeting emotions that make us human.

Chaaya began as a personal journey to document the world as I see it: raw, beautiful, and full of untold narratives. Over the years, it has evolved into a curated archive of memories—each photograph a testament to the stories people trust me to preserve.

My approach is simple: I don't just take pictures; I listen, observe, and wait for the right moment when everything aligns. Whether it's the golden hour glow on a bride's face or the candid laughter between friends, I'm there to capture it with intention and care.`;

  const highlights = data?.highlights || [
    {
      title: 'Storytelling Through Light',
      description: 'Every image is crafted with natural light and thoughtful composition to evoke emotion and authenticity.',
      icon: Camera
    },
    {
      title: 'Client-Centered Approach',
      description: 'Your vision drives the process. I collaborate closely to ensure every frame reflects your unique story.',
      icon: Heart
    },
    {
      title: 'Years of Experience',
      description: 'From intimate portraits to large-scale events, I bring expertise honed through hundreds of sessions.',
      icon: Award
    },
    {
      title: 'Trusted by Many',
      description: 'Families, couples, and creatives have trusted me to document their most meaningful moments.',
      icon: Users
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brand-300">
            About Chaaya
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            Stories Worth Remembering
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400">
            Capturing the quiet in-between moments, the unguarded smiles, and the timeless emotions 
            that make every story unique.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="mx-auto mb-12 h-px w-24 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

        {/* Bio Content */}
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-slate-300">
          {bio.split('\n\n').map((paragraph, index) => (
            <p key={index} className="indent-4 first:indent-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="mb-6 text-center text-xl font-semibold text-slate-50">
          What Sets Chaaya Apart
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon || Camera;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-brand-500/50 hover:shadow-soft"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-slate-50">
                    {highlight.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {highlight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <blockquote className="text-center">
            <p className="mb-4 text-lg italic leading-relaxed text-slate-200 md:text-xl">
              "A photograph is a pause button on life's fleeting moments. My goal is to make 
              those pauses feel eternal—vivid, honest, and beautifully imperfect."
            </p>
            <footer className="text-sm text-slate-500">— Photographer, Chaaya</footer>
          </blockquote>
        </div>
      </section>

      {/* Services Overview */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-6 text-center text-xl font-semibold text-slate-50">
          What I Photograph
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Portraits',
              description: 'Intimate sessions capturing personality, emotion, and the essence of who you are.',
              emoji: '👤'
            },
            {
              title: 'Weddings & Events',
              description: 'Comprehensive coverage of your special day, from preparation to celebration.',
              emoji: '💍'
            },
            {
              title: 'Lifestyle & Editorial',
              description: 'Creative collaborations for brands, publications, and personal projects.',
              emoji: '✨'
            }
          ].map((service, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center transition-colors hover:border-slate-700"
            >
              <div className="mb-3 text-3xl">{service.emoji}</div>
              <h3 className="mb-2 text-sm font-semibold text-slate-100">
                {service.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Location */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-3 flex items-center gap-2 text-slate-50">
              <MapPin className="h-5 w-5 text-brand-400" />
              <h3 className="text-base font-semibold">Based In</h3>
            </div>
            <p className="mb-2 text-sm text-slate-300">
              India
            </p>
            <p className="text-xs text-slate-500">
              Available for sessions locally and willing to travel for destination events and 
              special projects. Let's discuss how we can bring your vision to life.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-3 flex items-center gap-2 text-slate-50">
              <Mail className="h-5 w-5 text-brand-400" />
              <h3 className="text-base font-semibold">Let's Connect</h3>
            </div>
            <p className="mb-4 text-sm text-slate-300">
              Ready to start your project or have questions?
            </p>
            <Button asChild className="w-full">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-20 text-center">
        <h2 className="mb-3 text-xl font-semibold text-slate-50">
          Explore the Portfolio
        </h2>
        <p className="mb-6 text-sm text-slate-400">
          Browse through curated collections and discover the stories behind the lens.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/gallery">View Gallery</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/series">Browse Series</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
