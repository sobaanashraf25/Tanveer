import { useState, type FormEvent } from 'react';
import { Building2, Loader2, LogIn } from 'lucide-react';
import { adminLogin, saveSession, type AdminSession } from '@/lib/admin';
import { COMPANY } from '@/lib/contact';
import { inputClass, labelClass } from '@/lib/ui';

interface AdminLoginProps {
  onSignedIn: (session: AdminSession) => void;
}

export default function AdminLogin({ onSignedIn }: AdminLoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!phone.trim() || !password) {
      setError('Enter your phone number and password.');
      return;
    }

    setSubmitting(true);
    try {
      const session = await adminLogin(phone, password);
      saveSession(session);
      onSignedIn(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500 text-gold-600">
            <Building2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-semibold text-ink-900">{COMPANY.name}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Admin Sign In</p>
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl sm:p-10">
          <div>
            <label htmlFor="admin-phone" className={labelClass}>Phone number</label>
            <input
              id="admin-phone"
              type="tel"
              autoComplete="username"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your admin phone number"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className={labelClass}>Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            )}
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm">
          <a href="#/" className="text-ink-500 transition-colors hover:text-gold-700">
            Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
