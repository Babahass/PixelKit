import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ToolWorkspace } from "@/components/tool-workspace";
import { DocumentWorkspace } from "@/components/document-workspace";
import type { ToolDefinition } from "@/lib/tools";

export function ToolPage({ tool }: { tool: ToolDefinition }) {
  const isDocumentTool = tool.slug === "word-to-pdf" || tool.slug === "pdf-compressor";
  const faqs = [
    {
      question: `Are my ${isDocumentTool ? "documents" : "images"} uploaded or stored?`,
      answer: `No. Your selected ${isDocumentTool ? "documents" : "images"} are processed in your browser. PixelKit does not send file contents to a processing server. Your local browser and downloads are under your control.`,
    },
    {
      question: "Is there a file size or batch limit?",
      answer: "Each file can be up to 25 MB, and you can add up to 20 files per batch. Large batches may take longer on older devices.",
    },
    {
      question: `What happens to my ${isDocumentTool ? "document formatting" : "image quality"}?`,
      answer: isDocumentTool
        ? "Word documents are converted from their extracted text into a simple PDF, so complex layouts, images, and tables may not be retained. PDF re-saving may not reduce every file."
        : "Output size and appearance depend on the original image, its dimensions, transparency, target format, and encoder settings. Review the output and keep your original when it matters.",
    },
    {
      question: `Is ${isDocumentTool ? "document" : "image"} processing secure?`,
      answer: isDocumentTool
        ? "Processing runs locally in your browser. Only choose files you trust and keep an original copy of important documents."
        : "Image processing happens in your browser. SVGs are parsed and stripped of scripts, foreign content, and external resource references before rasterization. Avoid opening files you do not trust, and keep a copy of important originals.",
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

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
        <h1>{tool.title.split(" — ")[0]} <span>— {tool.title.split(" — ")[1]}</span></h1>
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
        <p>
          {isDocumentTool
            ? "Documents are processed locally in your browser. Conversion may simplify formatting, and PDF re-saving does not guarantee a smaller file. Review the downloaded result before sharing it."
            : "Images are processed locally using your browser&apos;s native image support. The output can vary slightly between browsers because their built-in encoders are not identical. Check the finished file before using it in a project with strict display or file-size requirements."}
        </p>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
