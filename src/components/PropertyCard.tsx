import { useState } from 'react';
import { ChevronDown, Home, Map as MapIcon, MapPin, MessageCircle, Store, Trees, type LucideIcon } from 'lucide-react';
import PropertyDetails from '@/components/PropertyDetails';
import { formatPrice } from '@/lib/format';
import { getWhatsAppLink } from '@/lib/contact';
import { CATEGORY_LABELS, getPhotoUrl, type Property, type PropertyCategory } from '@/lib/properties';

const CATEGORY_ICONS: Record<PropertyCategory, LucideIcon> = {
  plot: MapIcon,
  residential_land: Trees,
  commercial_land: Store,
  house: Home,
};

export default function PropertyCard({ property }: { property: Property }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[property.category];
  const cover = property.image_paths[0];
  const detailsId = `property-details-${property.id}`;
  const enquiryMessage = `Hello Tanveer Estates, I am interested in "${property.title}" in ${property.location}. Please share more details.`;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 ${
        expanded ? 'border-gold-400 shadow-xl' : 'border-ink-200 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl'
      }`}
    >
      <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-gold-50 to-gold-100 sm:h-64">
        {cover ? (
          <img
            src={getPhotoUrl(cover)}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Icon className="h-16 w-16 text-gold-600/70" aria-hidden="true" />
        )}
        {property.is_featured && (
          <span className="absolute left-4 top-4 rounded-full bg-ink-900 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-gold-200">
            Featured
          </span>
        )}
        {property.image_paths.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-ink-900/80 px-3 py-1 text-sm font-medium text-white">
            {property.image_paths.length} photos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-gold-700">
          {CATEGORY_LABELS[property.category]}
        </span>
        <h3 className="mt-2 text-3xl font-semibold leading-snug">{property.title}</h3>
        <p className="mt-3 flex items-center gap-2 text-lg text-ink-600">
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
          {property.location}
        </p>
        <p className="mt-4 line-clamp-2 text-lg leading-[1.6] text-ink-700">{property.description}</p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-ink-200 pt-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-ink-600">Price</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{formatPrice(property.price_lakh)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium uppercase tracking-wider text-ink-600">Area</p>
            <p className="mt-1 text-lg font-semibold text-ink-900">{property.area_sqft.toLocaleString('en-IN')} sq ft</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-5 py-3 text-lg font-semibold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            {expanded ? 'Hide details' : 'View full details'}
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-500 ease-in-out ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          <a
            href={getWhatsAppLink(enquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-gold-600"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      <div
        id={detailsId}
        className={`grid transition-[grid-template-rows,visibility] duration-500 ease-in-out ${
          expanded ? 'grid-rows-[1fr] visible' : 'invisible grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t border-ink-200 bg-white p-6 transition-all duration-500 ease-in-out sm:p-7 ${
              expanded ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
            }`}
          >
            <PropertyDetails property={property} />
          </div>
        </div>
      </div>
    </article>
  );
}
