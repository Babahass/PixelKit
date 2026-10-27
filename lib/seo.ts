import type { Metadata } from "next";
import { siteUrl, type ToolDefinition } from "@/lib/tools";

export function toolMetadata(tool: ToolDefinition): Metadata {
  const url = `${siteUrl}/${tool.slug}`;
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: tool.title,
      description: tool.description,
      siteName: "PixelKit",
    },
    twitter: {
      card: "summary",
      title: tool.title,
      description: tool.description,
    },
  };
}
