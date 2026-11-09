import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ImageOff, LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import PropertyEditor from '@/components/admin/PropertyEditor';
import { deleteProperty } from '@/lib/admin';
import { COMPANY } from '@/lib/contact';
import { CATEGORY_LABELS, fetchProperties, getPhotoUrl, type Property } from '@/lib/properties';
import { formatPrice } from '@/lib/format';

interface AdminDashboardProps {
  token: string;
  onSignOut: () => void;
}

type EditorState = { mode: 'closed' } | { mode: 'new' } | { mode: 'edit'; property: Property };

export default function AdminDashboard({ token, onSignOut }: AdminDashboardProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' });
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setProperties(await fetchProperties());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const closeEditor = useCallback(() => setEditor({ mode: 'closed' }), []);

  const handleSaved = () => {
    setEditor({ mode: 'closed' });
    load();
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    setDeletingId(id);
    try {
      await deleteProperty(token, id);
      setConfirmingId(null);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the property.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div>
            <p className="font-display text-xl font-semibold text-ink-900">{COMPANY.name}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-gold-700 sm:inline-flex"
            >
              View website
            </a>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-500"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Properties</h1>
            <p className="mt-2 text-sm text-ink-500">
              {status === 'ready'
                ? `${properties.length} ${properties.length === 1 ? 'listing' : 'listings'} on the website`
                : 'Manage the listings shown on your website.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditor({ mode: 'new' })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add property
          </button>
        </div>

        {actionError && (
          <p role="alert" className="mt-6 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
            {actionError}
          </p>
        )}

        <div className="mt-8">
          {status === 'loading' && (
            <p className="py-20 text-center text-sm text-ink-500">Loading properties...</p>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-error-500/20 bg-error-50 px-6 py-14 text-center">
              <AlertTriangle className="h-8 w-8 text-error-500" aria-hidden="true" />
              <p className="text-sm font-medium text-ink-800">The properties could not be loaded.</p>
              <button
                type="button"
                onClick={load}
                className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
              >
                Try again
              </button>
            </div>
          )}

          {status === 'ready' && properties.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
              <p className="text-base font-medium text-ink-800">No properties yet</p>
              <p className="mt-2 text-sm text-ink-500">Add your first listing and it will appear on the website.</p>
            </div>
          )}

          {status === 'ready' && properties.length > 0 && (
            <ul className="space-y-4">
              {properties.map((property) => {
                const cover = property.image_paths[0];
                const confirming = confirmingId === property.id;
                const deleting = deletingId === property.id;
                return (
                  <li
                    key={property.id}
                    className="flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-100 sm:h-20 sm:w-28">
                      {cover ? (
                        <img src={getPhotoUrl(cover)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff className="h-6 w-6 text-ink-400" aria-hidden="true" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-xl font-semibold">{property.title}</h2>
                        {property.is_featured && (
                          <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-500">
                        {CATEGORY_LABELS[property.category]} · {property.location} · {property.area_sqft.toLocaleString('en-IN')} sq ft
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink-900">{formatPrice(property.price_lakh)}</p>
                    </div>

                    {confirming ? (
                      <div className="flex flex-col gap-3 sm:items-end">
                        <p className="text-sm font-medium text-ink-700">Delete this listing and its photos?</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            disabled={deleting}
                            className="rounded-full border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-500 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(property.id)}
                            disabled={deleting}
                            className="rounded-full bg-error-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-error-700 disabled:opacity-60"
                          >
                            {deleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditor({ mode: 'edit', property })}
                          className="inline-flex items-center gap-2 rounded-full border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-gold-500 hover:text-gold-700"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(property.id)}
                          aria-label={`Delete ${property.title}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-error-500 transition-colors hover:bg-error-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {editor.mode !== 'closed' && (
        <PropertyEditor
          token={token}
          property={editor.mode === 'edit' ? editor.property : null}
          onClose={closeEditor}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
