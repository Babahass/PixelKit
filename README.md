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

