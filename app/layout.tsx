import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowUpRight, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { CurrentYear } from "@/components/current-year";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mediautilityhub.com";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ogImageUrl = `${siteUrl}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PixelKit — Free, Private Media & Document Utilities",
    template: "%s | PixelKit",
  },
  description:
    "Convert and compress images, DOCX, and PDF documents free in your browser. Private, client-side tools—your files never upload to any server.",
  applicationName: "PixelKit",
  authors: [{ name: "PixelKit" }],
  generator: "Next.js",
  keywords: [
    "image converter",
    "word to pdf",
    "pdf compressor",
    "webp to png",
    "compress image online",
    "private file converter",
  ],
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  openGraph: {
    type: "website",
    siteName: "PixelKit",
    title: "PixelKit — Free, Private Media & Document Utilities",
    description: "Convert and compress images, Word files, and PDFs directly in your browser.",
    url: siteUrl,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "PixelKit — Fast. Private. Client-Side.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelKit — Free, Private Media & Document Utilities",
    description: "Free, private image and document tools that run in your browser.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {adsenseClient ? (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClient)}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <header className="site-header">
          <nav className="nav-shell" aria-label="Main navigation">
            <Link className="brand" href="/" aria-label="PixelKit home">
              <span className="brand-icon"><ImageIcon size={19} strokeWidth={2.3} /></span>
              pixelkit<span className="brand-period">.</span>
            </Link>
            <div className="nav-links">
              <Link href="/#tools">All tools</Link>
              <Link href="/privacy-policy">Privacy</Link>
            </div>
            <span className="privacy-pill"><ShieldCheck size={14} /> 100% on-device</span>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div className="footer-inner">
            <Link className="brand footer-brand" href="/">
              <span className="brand-icon"><ImageIcon size={17} /></span> pixelkit<span className="brand-period">.</span>
            </Link>
            <p>Thoughtful client-side utilities. Your files stay yours.</p>
            <Link href="/privacy-policy">Privacy policy <ArrowUpRight size={13} /></Link>
            <span className="copyright">© <CurrentYear /> PixelKit</span>
          </div>
        </footer>
      </body>
    </html>
  );
}