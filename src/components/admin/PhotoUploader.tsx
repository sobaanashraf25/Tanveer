import { useState } from 'react';
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { uploadPhoto } from '@/lib/admin';
import { getPhotoUrl } from '@/lib/properties';

const MAX_PHOTOS = 12;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface PhotoUploaderProps {
  token: string;
  paths: string[];
  onChange: (paths: string[]) => void;
}

export default function PhotoUploader({ token, paths, onChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');

    const selected = Array.from(files);
    if (paths.length + selected.length > MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos per property.`);
      return;
    }
    const invalid = selected.find((f) => !ACCEPTED_TYPES.includes(f.type) || f.size > MAX_BYTES);
    if (invalid) {
      setError('Photos must be JPEG, PNG or WebP files under 5 MB.');
      return;
    }

    setUploading({ done: 0, total: selected.length });
    let current = paths;
    try {
      for (const file of selected) {
        const path = await uploadPhoto(token, file);
        current = [...current, path];
        onChange(current);
        setUploading((state) => (state ? { ...state, done: state.done + 1 } : state));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const makeCover = (index: number) => {
    const next = [paths[index], ...paths.filter((_, i) => i !== index)];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(paths.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-700">Photos</p>
        <span className="text-xs text-ink-400">
          {paths.length} of {MAX_PHOTOS} added. The first photo is the cover.
        </span>
      </div>

      {paths.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {paths.map((path, index) => (
            <li key={path} className="group relative overflow-hidden rounded-xl border border-ink-200 bg-ink-100">
              <img src={getPhotoUrl(path)} alt="" className="aspect-[4/3] w-full object-cover" />
              {index === 0 ? (
                <span className="absolute left-2 top-2 rounded-full bg-ink-900/85 px-2.5 py-1 text-xs font-semibold text-gold-200">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink-800 shadow-sm transition-colors hover:text-gold-700"
                >
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Make cover
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove photo"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-error-500 shadow-sm transition-colors hover:bg-error-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label
        className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 bg-ink-50 px-6 py-8 text-center transition-colors hover:border-gold-400 hover:bg-gold-50 ${
          uploading || paths.length >= MAX_PHOTOS ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-gold-600" aria-hidden="true" />
            <span className="text-sm font-medium text-ink-700">
              Uploading {uploading.done + 1} of {uploading.total}...
            </span>
          </>
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-gold-600" aria-hidden="true" />
            <span className="text-sm font-medium text-ink-700">Click to add photos</span>
            <span className="text-xs text-ink-400">JPEG, PNG or WebP, up to 5 MB each</span>
          </>
        )}
        <input
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className="sr-only"
          disabled={Boolean(uploading)}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}
