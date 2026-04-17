export function validateEgyptianPhone(phone: string): boolean {
  const regex = /^01[0125][0-9]{8}$/;
  return regex.test(phone);
}

export function sanitizeInput(text: string, maxLength: number = 500): string {
  if (!text) return "";
  // Strip HTML tags (Basic XSS protection)
  const noHtml = text.replace(/<\/?[^>]+(>|$)/g, "");
  // Trim excessive whitespace
  const noExtraSpaces = noHtml.replace(/\s{2,}/g, ' ').trim();
  
  return noExtraSpaces.substring(0, Math.max(0, maxLength));
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('ar-EG')} ج.م`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ').trim();
}
