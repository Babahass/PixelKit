import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowUpRight, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { CurrentYear } from "@/components/current-year";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mediautilityhub.com";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PixelKit — Free, Private Image Tools",
    template: "%s | PixelKit",
  },
  description:
    "Convert and compress images free in your browser. Private, fast WebP, PNG, JPG and SVG tools—your files never upload.",
  applicationName: "PixelKit",
  openGraph: {
    type: "website",
    siteName: "PixelKit",
    title: "PixelKit — Free, Private Image Tools",
    description: "Convert and compress images free in your browser. Your files stay on your device.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "PixelKit — Free, Private Image Tools",
    description: "Free, private image tools that run in your browser.",
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
            <p>Thoughtful image tools. Your files stay yours.</p>
            <Link href="/privacy-policy">Privacy policy <ArrowUpRight size={13} /></Link>
            <span className="copyright">© <CurrentYear /> PixelKit</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
