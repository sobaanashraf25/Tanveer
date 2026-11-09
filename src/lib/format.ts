function trimmed(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function formatPrice(priceLakh: number): string {
  if (priceLakh >= 100) {
    return `₹${trimmed(priceLakh / 100)} Cr`;
  }
  return `₹${trimmed(priceLakh)} Lakh`;
}
