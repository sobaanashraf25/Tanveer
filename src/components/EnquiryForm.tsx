import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { submitEnquiry } from '@/lib/enquiries';
import { CATEGORY_LABELS, type PropertyCategory } from '@/lib/properties';
import { inputClass } from '@/lib/ui';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const PROPERTY_OPTIONS: { value: PropertyCategory | 'any'; label: string }[] = [
  { value: 'any', label: 'Not sure yet' },
  { value: 'plot', label: CATEGORY_LABELS.plot },
  { value: 'residential_land', label: CATEGORY_LABELS.residential_land },
  { value: 'commercial_land', label: CATEGORY_LABELS.commercial_land },
  { value: 'house', label: CATEGORY_LABELS.house },
];

const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{5,18}[0-9]$/;

export default function EnquiryForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyCategory | 'any'>('any');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');

  const reset = () => {
    setName('');
    setPhone('');
    setPropertyType('any');
    setMessage('');
    setErrors({});
    setErrorText('');
    setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!PHONE_PATTERN.test(phone.trim())) nextErrors.phone = 'Please enter a valid phone number.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    setErrorText('');
    try {
      await submitEnquiry({ name, phone, propertyType, message });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorText('Your enquiry could not be sent. Please try again or message us on WhatsApp.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl bg-white p-10 text-center shadow-xl">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-500">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="text-3xl font-semibold">Thank you for your enquiry</h3>
        <p className="max-w-sm text-sm leading-[1.5] text-ink-600">
          Our team will get back to you shortly on the number you provided.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 rounded-full border border-ink-300 px-5 py-2.5 text-sm font-semibold text-ink-800 transition-colors hover:border-gold-500 hover:text-gold-700"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl sm:p-10">
      <h3 className="text-3xl font-semibold">Send an enquiry</h3>
      <p className="mt-2 text-sm text-ink-500">Share your details and we will call you back.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-name" className="mb-2 block text-sm font-medium text-ink-700">
            Full name
          </label>
          <input
            id="enquiry-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1.5 text-xs text-error-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="enquiry-phone" className="mb-2 block text-sm font-medium text-ink-700">
            Phone number
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="mt-1.5 text-xs text-error-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="enquiry-type" className="mb-2 block text-sm font-medium text-ink-700">
          What are you looking for?
        </label>
        <select
          id="enquiry-type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value as PropertyCategory | 'any')}
          className={inputClass}
        >
          {PROPERTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="enquiry-message" className="mb-2 block text-sm font-medium text-ink-700">
          Message <span className="font-normal text-ink-400">(optional)</span>
        </label>
        <textarea
          id="enquiry-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          className={`${inputClass} resize-none`}
          placeholder="Budget, preferred area, or any questions"
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-5 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
          {errorText}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {submitting ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}
