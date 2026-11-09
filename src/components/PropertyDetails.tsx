import { useState } from 'react';
import PhotoLightbox from '@/components/PhotoLightbox';
import { formatPrice } from '@/lib/format';
import { CATEGORY_LABELS, getPhotoUrl, type Property } from '@/lib/properties';

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = property.image_paths;

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-semibold text-ink-900">About this property</h4>
        <p className="mt-3 whitespace-pre-line text-lg leading-[1.6] text-ink-700">
          {property.description || 'No further description has been added yet. Message us for more details.'}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-ink-50 p-5">
        <div>
          <dt className="text-base text-ink-600">Type</dt>
          <dd className="mt-1 text-lg font-semibold text-ink-900">{CATEGORY_LABELS[property.category]}</dd>
        </div>
        <div>
          <dt className="text-base text-ink-600">Location</dt>
          <dd className="mt-1 text-lg font-semibold text-ink-900">{property.location}</dd>
        </div>
        <div>
          <dt className="text-base text-ink-600">Area</dt>
          <dd className="mt-1 text-lg font-semibold text-ink-900">{property.area_sqft.toLocaleString('en-IN')} sq ft</dd>
        </div>
        <div>
          <dt className="text-base text-ink-600">Price</dt>
          <dd className="mt-1 text-lg font-semibold text-ink-900">{formatPrice(property.price_lakh)}</dd>
        </div>
      </dl>

      {photos.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-ink-900">Photos ({photos.length})</h4>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((path, index) => (
              <li key={path}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Open photo ${index + 1}`}
                  className="group block w-full overflow-hidden rounded-xl bg-ink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  <img
                    src={getPhotoUrl(path)}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {openIndex !== null && (
        <PhotoLightbox
          urls={photos.map(getPhotoUrl)}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
