"use client";

/**
 * WhatsAppFABWrapper — conditionally renders WhatsAppFAB
 * Hides it on /admin/* pages so it doesn't interfere with the admin panel.
 */
import { usePathname } from 'next/navigation';
import { WhatsAppFAB } from './WhatsAppFAB';

export function WhatsAppFABWrapper() {
  const pathname = usePathname();

  // Don't show FAB on any admin page
  if (pathname?.startsWith('/admin')) return null;

  return <WhatsAppFAB />;
}
