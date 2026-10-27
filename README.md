# PixelKit

A static-exportable Next.js App Router site with private, browser-only image conversion and compression tools. Image bytes are read and processed with browser APIs; there is no image-processing backend.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and deploy

```bash
npm run lint
npm run build
```

Next.js exports the production site to `out/`, which can be deployed to Vercel or a static CDN. Configure `NEXT_PUBLIC_SITE_URL` to the real canonical HTTPS origin before building. Configure `NEXT_PUBLIC_ADSENSE_CLIENT` with your actual AdSense publisher ID to load the optional AdSense script; without it, no AdSense script is requested. Replace the publisher placeholder in `public/ads.txt` with your verified publisher record when approved. The sample `ads.txt` entry is not a real publisher authorization.

## Tools and safeguards

- WebP to PNG, PNG to JPG, SVG to PNG, and image compression with WebP, JPEG, or PNG output.
- Browser FileReader, sanitized SVG parsing, HTML canvas, and `canvas.toBlob()`.
- Multiple files per batch; 25 MB per image; 20 files per batch; output dimensions capped at 12,000 pixels.
- Quality and dimension controls reprocess converted files and report actual output-size changes.
- Temporary preview and output object URLs are revoked when removed, cleared, or when the tool unmounts.
- Tool pages include canonical, Open Graph, and Twitter metadata, explanatory content, FAQ structured data, and reserved advertisement slots.
- Set the real production hostname before deployment; `mediautilityhub.com` is a placeholder canonical origin.




//////////////
Act as a senior full-stack web engineer and technical SEO specialist. 

Build a fast, privacy-first, 100% client-side Media & Image Utility Web App designed for high search volume, high ad-viewability, and zero server-side image processing costs.

### Tech Stack & Architecture:
- Framework: Next.js (App Router, TypeScript) with Tailwind CSS and Lucide React icons.
- Processing Engine: HTML5 Canvas API + Web Worker / Native FileReader (zero backend uploads; processing runs purely in the user's browser).
- Styling: Modern, clean, responsive UI with dark/light mode support, clear drag-and-drop zones, batch processing queues, and dedicated placeholder slots for ads.

### Directory Structure to Implement:
app/
├── layout.tsx                // Global layout, Google AdSense script integration, Navbar, Footer
├── page.tsx                  // Dashboard home displaying tool cards with search/filtering
├── webp-to-png/page.tsx      // Dedicated converter page
├── png-to-jpg/page.tsx       // Dedicated converter page
├── svg-to-png/page.tsx       // Dedicated SVG rasterizer page
├── image-compressor/page.tsx // Compression utility with quality & scale sliders
├── privacy-policy/page.tsx   // AdSense-compliant legal page explaining 100% local processing
└── sitemap.ts                // Programmatic dynamic sitemap generator
public/
└── ads.txt                   // Standard publisher verification placeholder file

---

### Core Requirements & Implementation Details:

1. Client-Side Conversion Utilities (`lib/imageConverter.ts`):
   - Support single and batch drag-and-drop file inputs.
   - Use `HTMLCanvasElement`, `FileReader`, and `canvas.toBlob()`.
   - Provide options for output formats (`image/png`, `image/jpeg`, `image/webp`).
   - For compression, provide dynamic quality controls (0.1 to 1.0) and calculate file size reductions in real time (display original size vs. new size and percentage saved).
   - For `svg-to-png`, parse SVG input via an `Image` object or XMLSerializer, render at scale, and export high-DPI PNGs.
   - Clean up object URLs via `URL.revokeObjectURL` to prevent memory leaks during batch operations.

2. Page Layout Strategy (Targeting High Ad RPM & SEO):
   Each dedicated tool page must strictly follow a two-tier layout:
   - Upper Zone (Utility Tool):
     - Breadcrumbs (`Home > Tools > WebP to PNG`).
     - H1 heading targeting exact search intent (e.g., "Free WebP to PNG Converter – 100% Client-Side & Private").
     - Drag-and-drop file dropzone with visual feedback (hover, active, processing state).
     - Live preview grid with batch file list, target output badge, status indicators, and individual + "Download All (ZIP or sequential)" buttons.
     - Reserved Ad Slots: 
       * One 728x90 (or responsive banner) slot above the tool.
       * One responsive rectangular slot below the action/download button (isolated with clean margins and labeled 'Advertisement' to adhere to AdSense policies).
   - Lower Zone (Programmatic SEO Content):
     - 400–600 words of crawlable, indexable semantic content.
     - Section on "How to convert in 3 simple steps".
     - Technical comparison breakdown (e.g., WebP vs. PNG compression trade-offs).
     - Accordion-style FAQ schema markup addressing privacy, file size limits, and security.

3. AdSense & SEO Optimization:
   - Implement OpenGraph and Twitter card metadata in every `page.tsx` with dynamic titles, meta descriptions, and canonical URLs.
   - In `app/layout.tsx`, provide a conditional `<Script>` placeholder for `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX` configured with `strategy="afterInteractive"`.
   - Ensure the `ads.txt` is served directly from `/ads.txt` with standard format: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
   - Ensure full accessibility (WCAG AA), fast Core Web Vitals (no layout shifts when banners load), and responsive layout from mobile (320px) up to 4K displays.

Generate all necessary code files, components, and helper functions ready for production deployment on Vercel or any static CDN host.






/////////////////
Act as an elite Senior Full-Stack Engineer, Systems Architect, and Technical SEO Expert.

Build a production-ready, hyper-fast, privacy-first, 100% client-side Media & Document Utility Web Application. The application must achieve zero server-side image or text processing costs by running all conversion algorithms natively in the user's browser, making it infinitely scalable at near $0 hosting costs. It must be heavily optimized for Technical SEO indexing and Google AdSense ad-viewability metrics, ensuring a perfect 100/100 score on Core Web Vitals (specifically safeguarding against Cumulative Layout Shift).

### 🚀 Tech Stack Requirements:
- Framework: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS with Lucide React icons
- Core Client Processing Libraries: native HTML5 Canvas API, FileReader API, mammoth (for client-side docx parsing), html2pdf.js (for browser canvas print layouts)
- Accessibility: Complete WCAG AA compliance with explicit semantic markup across all components

### 📁 Target Directory Structure to Implement:
app/
├── layout.tsx                // Global layout with non-blocking, post-interactive script integration
├── page.tsx                  // Dashboard landing grid with contextual category filtering
├── webp-to-png/page.tsx      // Fast browser image converter view
├── png-to-jpg/page.tsx       // Fast browser image converter view
├── svg-to-png/page.tsx       // High-DPI canvas-rendered vector rasterizer view
├── image-compressor/page.tsx // Real-time image optimization tool with custom quality arrays
├── word-to-pdf/page.tsx      // Core client-side DOCX-to-PDF compiler layout
├── privacy-policy/page.tsx   // Highly comprehensive, explicit legal compliance page for AdSense
└── sitemap.ts                // Programmatic static route array file generator
components/
└── AdSlot.tsx                // Rigid skeleton ad component container ensuring strict zero-CLS layout shifts
lib/
├── imageConverter.ts         // Canvas transformation logic and object URL cleanup layers
└── docxProcessor.ts          // Client-side XML extraction and PDF compiling pipeline
public/
└── ads.txt                   // Authorized digital sellers publisher profile placeholder

---

### 🛠️ Execution & Component Architecture Requirements:

1. Dynamic Ad Containment & CLS Safeguard:
   - Create a reusable `AdSlot.tsx` component that accepts standard ad types ('banner' or 'rectangle').
   - Hardcode strict dimensions inside the containing wrapper elements (e.g., `min-h-[90px]` for 728x90 banners, `min-h-[250px]` for boxes) to save explicit viewport territory before external AdSense scripts load asynchronously.
   - Enforce proper standard notice labeling ("Advertisement") in micro-text style above the block to strictly prevent AdSense policy compliance flags.

2. Browser-Exclusive Document Engine (`lib/docxProcessor.ts`):
   - Implement the `convertDocxToPdfClient` asynchronous function using dynamic imports for 'mammoth' and 'html2pdf.js' to minimize the base layout package payload footprint.
   - Extract raw text patterns out of zipped openXML file architectures locally inside the client's browser, mapping it into a hidden, formatted print DOM container before exporting high-density, cleanly structured PDF binary blobs.

3. Complete Canvas Converter Base (`lib/imageConverter.ts`):
   - Program clean file-to-canvas rendering queues containing explicit high-DPI scaling features (`imageSmoothingQuality: "high"`).
   - Compute size deltas between incoming targets and outgoing binaries in real-time, calculating strict savings metric margins.
   - Attach reliable garbage collection routines via immediate `URL.revokeObjectURL` invocations inside download completion pipelines to protect local client system memory.

4. Consistent Programmatic Layout & Organic Search Intent:
   - Each distinct route page must utilize a strict structural split: Upper Workspace (Tool Area) and Lower Semantic Copy Block (SEO Area).
   - Upper Workspace must render clean drag-and-drop dropzones with active structural feedback alongside clean file list queues. Include a 728x90 banner slot above the tool area, and an ad box slot directly below the core processing engine actions.
   - Lower Content Blocks must maintain 400-600 words of deeply indexable semantic text, structured 3-step walk-through sections, clear technical file format comparison layouts, and accessible accordion style structures targeting organic query vectors.

5. Application Core Shell (`app/layout.tsx`):
   - Implement optimized performance metrics by utilizing the Next.js `next/script` component configured with `strategy="afterInteractive"` to pull down the AdSense resource layer without blocking critical page hydration.

Provide the full, clean codebase across all target files, ensuring no placeholder ellipses, shorthand assumptions, or incomplete functions exist. All imports, type parameters, styling details, and programmatic elements must be fully complete and ready to deploy straight to Vercel.
