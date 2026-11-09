export const COMPANY = {
  name: 'Tanveer Estates',
  city: 'Patna, Bihar',
  phoneDisplay: '+91 76340 93102',
  whatsappNumber: '917634093102',
  whatsappMessage: 'Hello Tanveer Estates, I am interested in a property. Please share details.',
};

export function getWhatsAppLink(message: string = COMPANY.whatsappMessage): string {
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
