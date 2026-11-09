import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { CATEGORY_LABELS, fetchProperties, type Property, type PropertyCategory } from '@/lib/properties';

type Filter = 'all' | PropertyCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Properties' },
  { value: 'plot', label: CATEGORY_LABELS.plot },
  { value: 'residential_land', label: CATEGORY_LABELS.residential_land },
  { value: 'commercial_land', label: CATEGORY_LABELS.commercial_land },
  { value: 'house', label: CATEGORY_LABELS.house },
];

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const rows = await fetchProperties();
      setProperties(rows);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === 'all' ? properties : properties.filter((p) => p.category === filter)),
    [properties, filter],
  );

  return (
    <section id="properties" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Our Listings</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Properties in Patna</h2>
            <p className="mt-4 text-lg leading-[1.6] text-ink-700">
              Choose a category to see what is available, then reach out on WhatsApp for site visits and
              pricing details.
            </p>
          </div>
        </div>

        <div role="tablist" aria-label="Filter properties" className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((item) => {
            const active = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.value)}
                className={`shrink-0 rounded-full border px-6 py-3 text-base font-medium transition-all duration-200 ${
                  active
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-gold-400 hover:text-gold-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-3 py-24 text-ink-500">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span className="text-sm">Loading listings...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-error-500/20 bg-error-50 px-6 py-16 text-center">
              <AlertTriangle className="h-8 w-8 text-error-500" aria-hidden="true" />
              <p className="text-base font-medium text-ink-800">We could not load the listings right now.</p>
              <button
                type="button"
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {status === 'ready' && visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-300 px-6 py-16 text-center">
              <p className="text-base text-ink-600">No listings in this category yet. Message us and we will help you find one.</p>
            </div>
          )}

          {status === 'ready' && visible.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
