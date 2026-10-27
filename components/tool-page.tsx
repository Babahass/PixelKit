import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ToolWorkspace } from "@/components/tool-workspace";
import { DocumentWorkspace } from "@/components/document-workspace";
import { toolJsonLd } from "@/lib/seo";
import type { ToolDefinition } from "@/lib/tools";

export function ToolPage({ tool }: { tool: ToolDefinition }) {
  const isDocumentTool = tool.slug === "word-to-pdf" || tool.slug === "pdf-compressor";

  const faqs = [
    {
      question: `Are my ${isDocumentTool ? "documents" : "images"} uploaded or stored?`,
      answer: `No. Your selected ${isDocumentTool ? "documents" : "images"} are processed locally in your browser. PixelKit does not send file contents to any server.`,
    },
    {
      question: "Is there a file size or batch limit?",
      answer: "Each file can be up to 25 MB, and you can add up to 20 files per batch. Large batches may take longer on low-powered devices.",
    },
    {
      question: `What happens to my ${isDocumentTool ? "document formatting" : "image quality"}?`,
      answer: isDocumentTool
        ? "Word documents retain their headings, tables, inline images, and styling in a clean A4 PDF layout. PDF compression optimizes visual elements to reduce file weight while maintaining legibility."
        : "Output size and appearance depend on the original image, its dimensions, transparency, target format, and encoder settings. Review the output and keep your original when it matters.",
    },
    {
      question: `Is ${isDocumentTool ? "document" : "image"} processing secure?`,
      answer: "All processing runs entirely on your device using client-side WebAssembly and JavaScript. No document or picture ever travels over the internet.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const appSchema = toolJsonLd(tool);

  return (
    <main>
      <div className="tool-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={13} />
          <Link href="/#tools">Tools</Link><ChevronRight size={13} />
          <span aria-current="page">{tool.shortName}</span>
        </nav>
      </div>
      <section className="hero tool-hero">
        <span className="eyebrow"><Sparkles size={13} /> Free browser-based {isDocumentTool ? "document" : "image"} tool</span>
        <h1>{tool.title.split(" — ")[0]} <span>— {tool.title.split(" — ")[1] ?? ""}</span></h1>
        <p className="hero-copy">{tool.description}</p>
        <div className="trust-row"><ShieldCheck size={13} /> No uploads. No signup. Just your browser.</div>
      </section>
      <AdSlot />
      {isDocumentTool ? <DocumentWorkspace tool={tool} /> : <ToolWorkspace tool={tool} />}
      <article className="article">
        <h2>How to {tool.shortName.toLowerCase()} in 3 simple steps</h2>
        <ol>{tool.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <h2>About this free {tool.shortName.toLowerCase()}</h2>
        {tool.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h2>Format comparison: what to expect</h2>
        <p>{tool.comparison}</p>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </article>

      {/* Dual Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}