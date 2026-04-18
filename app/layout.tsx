import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { getSettings } from "@/lib/data/settings";
import { ToastProvider } from "@/components/ui/Toast";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

// Force dynamic rendering because Navbar uses cookies() via getSettings()
export const dynamic = "force-dynamic";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export async function generateMetadata(): Promise<Metadata> {
  let storeName = "Heru Store";
  try {
    const { data: settings } = await getSettings();
    /**
     * WHY the old code was wrong:
     * The old code did supabase.from("settings").select("store_name").single()
     * This tries to SELECT a COLUMN called "store_name" from the settings table.
     * But settings is a key-value table: (id, key, value).
     * There IS no "store_name" column — only rows where key = 'store_name'.
     * .single() would also fail if multiple rows exist, crashing the entire layout.
     *
     * Fix: use getSettings() which correctly fetches all key-value rows and
     * converts them to a flat object.
     */
    if (settings?.store_name) {
      storeName = settings.store_name;
    }
  } catch (error) {
    console.error("[Layout] Failed to fetch store settings for metadata:", error);
  }

  return {
    title: {
      default: storeName,
      template: `%s | ${storeName}`,
    },
    description: `مرحباً بك في ${storeName}، أفضل متجر للتسوق الإلكتروني`,
    openGraph: {
      title: storeName,
      description: `مرحباً بك في ${storeName}، أفضل متجر للتسوق الإلكتروني`,
      siteName: storeName,
      locale: "ar_EG",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * Fetch settings once here so we can:
   *  1. Show the AnnouncementBar (was missing entirely from the layout)
   *  2. Inject the store_accent_color as a CSS custom property so all
   *     brand-* Tailwind classes pick up the dynamic color.
   *
   * getSettings() uses the server Supabase client which is request-scoped,
   * so concurrent calls within the same render pass are deduplicated.
   */
  const { data: settings } = await getSettings();
  const accentColor = settings?.store_accent_color || "#7c3aed";

  /**
   * Inject the accent color as a CSS variable on <body>.
   * This overrides --color-brand-600 (Tailwind v4 custom-property convention)
   * for every component that uses bg-brand-600, text-brand-600, etc.
   */
  const accentCssVars = {
    "--color-brand-600": accentColor,
    "--color-brand-700": accentColor, // slightly darker tones kept same for simplicity
    "--color-brand-50":  `${accentColor}14`, // 8% opacity tint
    "--color-brand-100": `${accentColor}29`, // 16% opacity tint
  } as React.CSSProperties;

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="antialiased min-h-screen flex flex-col font-arabic" style={accentCssVars}>
        {/* GoogleAnalytics uses useSearchParams — must be wrapped in Suspense */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        {/*
          AnnouncementBar was NOT rendered anywhere before — it was defined
          but never mounted in the layout. Adding it here shows it on every page.
          It reads announcement_active and announcement_items from the settings prop.
        */}
        <AnnouncementBar settings={settings} />

        <ToastProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </ToastProvider>
      </body>
    </html>
  );
}
