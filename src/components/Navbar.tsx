import { useEffect, useState } from 'react';
import { Building2, Menu, MessageCircle, X } from 'lucide-react';
import { COMPANY, getWhatsAppLink } from '@/lib/contact';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#properties', label: 'Properties' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid ? 'bg-white/95 shadow-sm backdrop-blur border-b border-ink-200' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
              solid ? 'border-gold-500 text-gold-600' : 'border-gold-300 text-gold-300'
            }`}
          >
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span
            className={`font-display text-xl font-semibold tracking-wide transition-colors duration-300 ${
              solid ? 'text-ink-900' : 'text-white'
            }`}
          >
            {COMPANY.name}
          </span>
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold-500 ${
                solid ? 'text-ink-700' : 'text-white/90'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:shadow-md"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp Us
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden ${
            solid ? 'text-ink-900 hover:bg-ink-100' : 'text-white hover:bg-white/10'
          }`}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink-200 bg-white px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-ink-800"
              >
                {link.label}
              </a>
            ))}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
