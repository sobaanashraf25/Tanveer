import { MapPin, MessageCircle, Phone } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';
import { COMPANY, getWhatsAppLink } from '@/lib/contact';

export default function Contact() {
  return (
    <section id="contact" className="bg-ink-50 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Get in Touch</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Let us find your next property</h2>
          <p className="mt-5 max-w-lg text-base leading-[1.5] text-ink-600">
            Tell us what you are looking for and our team will respond. For the quickest reply, message us
            directly on WhatsApp.
          </p>

          <ul className="mt-10 space-y-6">
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-400">Phone</p>
                <a href={`tel:+${COMPANY.whatsappNumber}`} className="text-lg font-semibold text-ink-900 hover:text-gold-700">
                  {COMPANY.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-400">Location</p>
                <p className="text-lg font-semibold text-ink-900">{COMPANY.city}</p>
              </div>
            </li>
          </ul>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:shadow-lg"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>

        <EnquiryForm />
      </div>
    </section>
  );
}
