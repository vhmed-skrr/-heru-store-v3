import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { ToastProvider } from "@/components/ui/Toast";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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
        <GoogleAnalytics />
        <ToastProvider>
          {children}
          <CartDrawer />
        </ToastProvider>
      </body>
    </html>
  );
}
