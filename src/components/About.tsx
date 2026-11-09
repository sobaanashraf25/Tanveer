import { Building2, MapPin, Trophy, Layers } from 'lucide-react';
import { COMPANY } from '@/lib/contact';

const STATS = [
  { icon: Trophy, value: '₹10 Cr+', label: 'Worth of properties sold' },
  { icon: Layers, value: '4', label: 'Property types we deal in' },
  { icon: MapPin, value: 'Patna', label: 'Bihar, where we work' },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">About Us</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">A trusted name in Patna real estate</h2>
          <p className="mt-6 text-base leading-[1.5] text-ink-600">
            {COMPANY.name} helps families, investors and businesses find the right plot, land or house in and
            around Patna. We keep every deal simple and transparent, from the first site visit to the final
            paperwork.
          </p>
          <p className="mt-4 text-base leading-[1.5] text-ink-600">
            Whether you are buying your first plot or expanding a commercial portfolio, our team is one call or
            WhatsApp message away.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-700">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="font-display text-xl font-semibold text-ink-900">{COMPANY.name}</p>
          </div>
        </div>

        <ul className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          {STATS.map(({ icon: Icon, value, label }) => (
            <li
              key={label}
              className="flex items-center gap-5 rounded-2xl border border-ink-200 bg-ink-50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md lg:p-8"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-900 text-gold-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold text-ink-900">{value}</p>
                <p className="mt-1 text-sm text-ink-500">{label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
