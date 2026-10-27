import type { MetadataRoute } from "next";
import { siteUrl, tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/privacy-policy", ...tools.map((tool) => `/${tool.slug}`)];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/privacy-policy" ? 0.3 : 0.8,
  }));
}
