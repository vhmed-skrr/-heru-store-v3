import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { ToastProvider } from "@/components/ui/Toast";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from("settings")
      .select("store_name")
      .single();

    if (settings?.store_name) {
      storeName = settings.store_name;
    }
  } catch (error) {
    console.error("Failed to fetch store settings for metadata", error);
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="antialiased min-h-screen flex flex-col font-arabic">
        {/* GoogleAnalytics uses useSearchParams — must be wrapped in Suspense */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
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
