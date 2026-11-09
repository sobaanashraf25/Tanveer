import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, X } from 'lucide-react';
import PhotoUploader from '@/components/admin/PhotoUploader';
import { saveProperty, type PropertyInput } from '@/lib/admin';
import { CATEGORY_LABELS, type Property, type PropertyCategory } from '@/lib/properties';
import { formatPrice } from '@/lib/format';
import { inputClass, labelClass } from '@/lib/ui';

interface PropertyEditorProps {
  token: string;
  property: Property | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [PropertyCategory, string][];

export default function PropertyEditor({ token, property, onClose, onSaved }: PropertyEditorProps) {
  const [title, setTitle] = useState(property?.title ?? '');
  const [category, setCategory] = useState<PropertyCategory>(property?.category ?? 'plot');
  const [location, setLocation] = useState(property?.location ?? '');
  const [areaSqft, setAreaSqft] = useState(property ? String(property.area_sqft) : '');
  const [priceLakh, setPriceLakh] = useState(property ? String(property.price_lakh) : '');
  const [description, setDescription] = useState(property?.description ?? '');
  const [isFeatured, setIsFeatured] = useState(property?.is_featured ?? false);
  const [photos, setPhotos] = useState<string[]>(property?.image_paths ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, saving]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const area = Number(areaSqft);
    const price = Number(priceLakh);
    if (!title.trim()) return setError('Enter a title for the property.');
    if (!location.trim()) return setError('Enter the location.');
    if (!Number.isInteger(area) || area <= 0) return setError('Enter the area in square feet.');
    if (!Number.isFinite(price) || price <= 0) return setError('Enter the price in lakhs.');

    const input: PropertyInput = {
      title: title.trim(),
      category,
      location: location.trim(),
      area_sqft: area,
      price_lakh: price,
      description: description.trim(),
      is_featured: isFeatured,
      image_paths: photos,
    };

    setSaving(true);
    try {
      await saveProperty(token, input, property?.id);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/60 p-4 backdrop-blur-sm sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-editor-title"
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink-200 px-6 py-5 sm:px-8">
          <h2 id="property-editor-title" className="text-3xl font-semibold">
            {property ? 'Edit property' : 'Add property'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8">
          <div>
            <label htmlFor="property-title" className={labelClass}>Title</label>
            <input
              id="property-title"
              type="text"
              value={title}
              maxLength={150}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Corner plot near ring road"
              className={inputClass}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="property-category" className={labelClass}>Property type</label>
              <select
                id="property-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="property-location" className={labelClass}>Location</label>
              <input
                id="property-location"
                type="text"
                value={location}
                maxLength={150}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Danapur, Patna"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="property-area" className={labelClass}>Area (sq ft)</label>
              <input
                id="property-area"
                type="number"
                min={1}
                step={1}
                value={areaSqft}
                onChange={(e) => setAreaSqft(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="property-price" className={labelClass}>Price (lakh)</label>
              <input
                id="property-price"
                type="number"
                min={0}
                step={0.01}
                value={priceLakh}
                onChange={(e) => setPriceLakh(e.target.value)}
                placeholder="85"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-ink-400">
                {Number(priceLakh) > 0
                  ? `Shown on the website as ${formatPrice(Number(priceLakh))}`
                  : 'Enter in lakhs. 100 lakh = 1 Cr.'}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="property-description" className={labelClass}>Description</label>
            <textarea
              id="property-description"
              rows={4}
              maxLength={3000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-gold-600 focus:ring-gold-400"
            />
            Show as featured property
          </label>

          <PhotoUploader token={token} paths={photos} onChange={setPhotos} />

          {error && (
            <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {saving ? 'Saving...' : property ? 'Save changes' : 'Publish property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
