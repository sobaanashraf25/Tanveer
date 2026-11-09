import { ArrowRight, MapPin } from 'lucide-react';
import { COMPANY } from '@/lib/contact';

const HERO_IMAGE =
  'https://images.pexels.com/photos/4933643/pexels-photo-4933643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink-900">
      <img
        src={HERO_IMAGE}
        alt="Modern home lit up at dusk"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/20" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-8 lg:pb-28">
        <div className="max-w-3xl animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-ink-900/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {COMPANY.city}
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            Find the ground you will build your future on
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.5] text-white/85 sm:text-lg">
            Plots, residential land, commercial land and houses across Patna. Browse our curated
            listings and speak with our team directly.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#properties"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400 hover:text-ink-900"
            >
              Explore Properties
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-gold-300 hover:text-gold-200"
            >
              Enquire Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
