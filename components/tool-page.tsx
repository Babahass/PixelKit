import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ToolWorkspace } from "@/components/tool-workspace";
import type { ToolDefinition } from "@/lib/tools";

export function ToolPage({ tool }: { tool: ToolDefinition }) {
  const faqs = [
    {
      question: "Are my images uploaded or stored?",
      answer: "No. Your selected image is read, rendered, and exported in your browser. PixelKit does not send image contents to a processing server. Your local browser and its downloads are under your control.",
    },
    {
      question: "Is there a file size or batch limit?",
      answer: "Each image can be up to 25 MB, and you can add up to 20 files per batch. Output dimensions are capped at 12,000 pixels on the longest edge to help protect browser memory. Large batches may take longer on older devices.",
    },
    {
      question: "Is it safe to convert an image here?",
      answer: "Image processing happens in your browser. SVGs are parsed and stripped of scripts, foreign content, and external resource references before rasterization. Avoid opening files you do not trust, and keep a copy of important originals.",
    },
    {
      question: "Why is the converted file larger or visually different?",
      answer: "Output size and appearance depend on the original image, its dimensions, transparency, target format, and encoder settings. Lossy formats trade some image detail for smaller files. Review the output and keep your original when it matters.",
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
        <span className="eyebrow"><Sparkles size={13} /> Free browser-based image tool</span>
        <h1>{tool.title.split(" — ")[0]} <span>— {tool.title.split(" — ")[1]}</span></h1>
        <p className="hero-copy">{tool.description}</p>
        <div className="trust-row"><ShieldCheck size={13} /> No uploads. No signup. Just your browser.</div>
      </section>
      <AdSlot />
      <ToolWorkspace tool={tool} />
      <article className="article">
        <h2>How to {tool.shortName.toLowerCase()} in 3 simple steps</h2>
        <ol>{tool.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <h2>About this free {tool.shortName.toLowerCase()}</h2>
        {tool.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h2>Format comparison: what to expect</h2>
        <p>{tool.comparison}</p>
        <p>
          Images are processed locally using your browser&apos;s native image support. The output can vary slightly between browsers because their built-in encoders are not identical. Check the finished file before using it in a project with strict display or file-size requirements.
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
