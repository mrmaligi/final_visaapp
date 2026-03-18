import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VisaHelper - Simplify Your Australian Visa Journey",
    template: "%s | VisaHelper",
  },
  description: "VisaHelper simplifies Australian visa applications with guided tools, document management, and access to verified immigration lawyers. Start your journey today.",
  keywords: ["Australian visa", "immigration", "visa application", "Australia", "migration", "lawyer", "consultation"],
  authors: [{ name: "VisaHelper" }],
  creator: "VisaHelper Inc.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://visahelper.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "VisaHelper",
    title: "VisaHelper - Simplify Your Australian Visa Journey",
    description: "VisaHelper simplifies Australian visa applications with guided tools, document management, and access to verified immigration lawyers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisaHelper - Australian Visa Application Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisaHelper - Simplify Your Australian Visa Journey",
    description: "VisaHelper simplifies Australian visa applications with guided tools and expert support.",
    images: ["/og-image.png"],
    creator: "@visahelper",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0052cc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
