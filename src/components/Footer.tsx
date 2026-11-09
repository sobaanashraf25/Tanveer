import { Building2 } from 'lucide-react';
import { COMPANY } from '@/lib/contact';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-900 py-12 text-ink-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 text-gold-300">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-white">{COMPANY.name}</p>
            <p className="text-sm text-ink-400">{COMPANY.city}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm md:items-end">
          <a href={`tel:+${COMPANY.whatsappNumber}`} className="transition-colors hover:text-gold-300">
            {COMPANY.phoneDisplay}
          </a>
          <p className="text-ink-600">&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <a href="#/admin" className="text-xs text-ink-500 transition-colors hover:text-gold-300">Admin sign in</a>
        </div>
      </div>
    </footer>
  );
}
