"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileImage, ImageDown, Images, Search, Sparkles } from "lucide-react";
import { tools } from "@/lib/tools";

const icons = [Images, ImageDown, FileImage, Sparkles];

export function ToolDirectory() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tools;
    return tools.filter((tool) => `${tool.name} ${tool.description} ${tool.keywords.join(" ")}`.toLowerCase().includes(term));
  }, [query]);

  return (
    <section className="home-tools" id="tools">
      <div className="section-heading">
        <div><h2>Pick your pixel-perfect tool</h2><p>Free tools for the little image jobs that add up.</p></div>
        <label className="search-wrap">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a tool…" aria-label="Search image tools" />
        </label>
      </div>
      <div className="tool-grid">
        {filtered.map((tool) => {
          const Icon = icons[tools.indexOf(tool)];
          return (
            <Link className="tool-link" href={`/${tool.slug}`} key={tool.slug}>
              <span className="tool-card-icon"><Icon size={17} /></span>
              <h3>{tool.shortName} <ArrowUpRight size={12} /></h3>
              <p>{tool.description.split(".")[0]}.</p>
            </Link>
          );
        })}
        {filtered.length === 0 ? <p className="empty-tools">No tools match “{query}”. Try a format like PNG or WebP.</p> : null}
      </div>
    </section>
  );
}
