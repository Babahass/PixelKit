import type { Metadata } from "next";
import { siteUrl, type ToolDefinition } from "@/lib/tools";

export function toolMetadata(tool: ToolDefinition): Metadata {
  const url = `${siteUrl}/${tool.slug}`;
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
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
    openGraph: {
      type: "website",
      url,
      title: tool.title,
      description: tool.description,
      siteName: "PixelKit",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tool.name} — PixelKit`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generates SoftwareApplication / WebApplication JSON-LD schema for rich search results.
 */
export function toolJsonLd(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `${siteUrl}/${tool.slug}`,
    description: tool.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires modern JavaScript-enabled browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: tool.steps.join(", "),
  };
}