import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/contact';

export default function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Tanveer Estates on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" aria-hidden="true" />
      <MessageCircle className="relative h-7 w-7" aria-hidden="true" />
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
