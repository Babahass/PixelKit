import type { Metadata } from "next";
import { ArrowDown, LockKeyhole, Sparkles } from "lucide-react";
import { ToolDirectory } from "@/components/tool-directory";
import { siteUrl } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Online Image Converter & Compressor — Private by Design",
  description: "Convert WebP, PNG, JPG and SVG images or compress photos for free. Private browser-based image tools—your files never upload.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Free Online Image Converter & Compressor | PixelKit",
    description: "Fast, free browser-based image conversion and compression. Your files stay on your device.",
    siteName: "PixelKit",
  },
  twitter: {
    card: "summary",
    title: "Free Online Image Converter & Compressor | PixelKit",
    description: "Private image tools that run entirely in your browser.",
  },
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow"><Sparkles size={13} /> YOUR IMAGES, YOUR DEVICE</span>
        <h1>Good images.<br /><span>Zero upload anxiety.</span></h1>
        <p className="hero-copy">Handy little tools to convert and compress your images. No uploads, no accounts, no funny business.</p>
        <div className="trust-row"><LockKeyhole size={13} /> Processed right here in your browser <span aria-hidden="true">·</span> Always free</div>
        <a href="#tools" className="browse-button" style={{ marginTop: 20 }}>Explore the tools <ArrowDown size={14} /></a>
      </section>
      <ToolDirectory />
    </main>
  );
}
