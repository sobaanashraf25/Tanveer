import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
interface PhotoLightboxProps {
  urls: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const navButtonClass =
  'absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300';

export default function PhotoLightbox({ urls, index, onIndexChange, onClose }: PhotoLightboxProps) {
  const total = urls.length;
  const goPrevious = () => onIndexChange((index - 1 + total) % total);
  const goNext = () => onIndexChange((index + 1) % total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + total) % total);
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % total);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, total, onClose, onIndexChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Property photo"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-4 animate-fade-in"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrevious();
          }}
          aria-label="Previous photo"
          className={`${navButtonClass} left-3 sm:left-6`}
        >
          <ChevronLeft className="h-7 w-7" aria-hidden="true" />
        </button>
      )}

      <figure className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <img
          key={urls[index]}
          src={urls[index]}
          alt={`Photo ${index + 1} of ${total}`}
          className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain animate-fade-in"
        />
        <figcaption className="text-base font-medium text-white/85">
          {index + 1} of {total}
        </figcaption>
      </figure>

      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next photo"
          className={`${navButtonClass} right-3 sm:right-6`}
        >
          <ChevronRight className="h-7 w-7" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
