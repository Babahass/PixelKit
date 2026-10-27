import type { Metadata } from "next";
import { ArrowDown, LockKeyhole, Sparkles } from "lucide-react";
import { ToolDirectory } from "@/components/tool-directory";
import { siteUrl } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Online Image & Document Converter — Private by Design",
  description:
    "Convert and compress images, DOCX to PDF, and reduce PDF sizes for free. Fast, private browser-based utilities—your files never leave your device.",
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Free Online Image & Document Tools | PixelKit",
    description: "Fast, free browser-based file conversion and compression. 100% on-device privacy.",
    siteName: "PixelKit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image & Document Tools | PixelKit",
    description: "Private image and document tools that run entirely in your browser.",
  },
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PixelKit",
    url: siteUrl,
    description: "Free, client-side image and document utility tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/#tools`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main>
      <section className="hero">
        <span className="eyebrow"><Sparkles size={13} /> YOUR FILES, YOUR DEVICE</span>
        <h1>Fast file tools.<br /><span>Zero upload anxiety.</span></h1>
        <p className="hero-copy">
          Convert and compress images, Word documents, and PDFs directly in your browser. No server uploads, no accounts, and no tracking.
        </p>
        <div className="trust-row">
          <LockKeyhole size={13} /> Processed locally on your device <span aria-hidden="true">·</span> Always free
        </div>
        <a href="#tools" className="browse-button" style={{ marginTop: 20 }}>
          Explore the tools <ArrowDown size={14} />
        </a>
      </section>
      <ToolDirectory />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}