import { MessageCircle, Phone } from 'lucide-react';
import { COMPANY, getWhatsAppLink } from '@/lib/contact';

export default function CallToAction() {
  return (
    <section className="bg-ink-900 py-20 lg:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Ready when you are</p>
        <h2 className="text-4xl font-semibold text-white sm:text-5xl">Let us find your next property in Patna</h2>
        <p className="max-w-2xl text-base leading-[1.5] text-white/80">
          Send us a message on WhatsApp or give us a call. We will reply with the best options for your budget.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400 hover:text-ink-900"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
          <a
            href={`tel:+${COMPANY.whatsappNumber}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:border-gold-300 hover:text-gold-200"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {COMPANY.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
