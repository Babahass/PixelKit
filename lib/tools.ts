import type { OutputFormat } from "@/lib/imageConverter";

export type ToolSlug =
  | "webp-to-png"
  | "png-to-jpg"
  | "svg-to-png"
  | "image-compressor"
  | "word-to-pdf"
  | "pdf-compressor";

export type ToolDefinition = {
  slug: ToolSlug;
  name: string;
  shortName: string;
  title: string;
  description: string;
  formats: string[];
  accepts: string;
  format: OutputFormat;
  quality: number;
  scale: number;
  compression?: boolean;
  keywords: string[];
  steps: string[];
  paragraphs: string[];
  comparison: string;
};

export const tools: ToolDefinition[] = [
  {
    slug: "webp-to-png",
    name: "WebP to PNG Converter",
    shortName: "WebP to PNG",
    title: "Free WebP to PNG Converter — Private & Instant",
    description:
      "Convert WebP images to crisp PNG files online for free. Batch convert privately in your browser—your images are never uploaded.",
    formats: ["WEBP", "PNG"],
    accepts: "image/webp,.webp",
    format: "image/png",
    quality: 1,
    scale: 1,
    keywords: ["convert webp to png", "webp to png online", "webp converter"],
    steps: [
      "Select or drop one or more WebP images into the converter.",
      "Review your files and choose Convert to PNG.",
      "Download each PNG, or save the converted files one by one.",
    ],
    paragraphs: [
      "Need to convert a WebP image to PNG? PixelKit makes it straightforward: choose a WebP image or add a batch, convert it in your browser, and download the PNG. No account, installation, or upload is required. This is useful when a site, editor, slide deck, or workflow accepts PNG but does not recognize WebP. Add multiple images together to convert them in one session and see each result alongside its original file.",
      "The conversion reads the selected file locally with your browser, decodes its image pixels, and draws them onto an HTML canvas before exporting PNG. Your original file is not sent to PixelKit. The converter accepts files up to 25 MB each and limits output dimensions to protect browser memory. A very large image may therefore be scaled down to a maximum dimension of 12,000 pixels. Keep the tab open until processing and downloads finish; clearing the queue also releases the preview resources.",
      "WebP is a modern web format that often makes images smaller than older formats, while PNG is a widely supported lossless format that is especially useful for sharp graphics, interface assets, and transparent backgrounds. Converting WebP to PNG does not restore image detail that was discarded when a lossy WebP was originally created. It can also increase file size because PNG prioritizes pixel accuracy and compatibility rather than compact delivery. The new PNG keeps transparency when present in the source.",
      "For the smallest website image, keeping the original WebP is often the better choice. Choose PNG when you need broad editor compatibility, lossless pixel handling from the decoded source, or transparent artwork in a program that cannot open WebP. Compare the new file size before sharing or publishing; conversion changes the container format, not the visual history of the source image.",
    ],
    comparison:
      "WebP usually delivers smaller web downloads; PNG offers broad compatibility and lossless encoding of the decoded pixels. A PNG can be substantially larger, and conversion cannot recreate detail lost in a lossy WebP.",
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    shortName: "PNG to JPG",
    title: "Free PNG to JPG Converter — Fast, Private & Easy",
    description:
      "Convert PNG images to compact JPG files in seconds. Adjust image quality, convert a batch, and keep your images on your device.",
    formats: ["PNG", "JPG"],
    accepts: "image/png,.png",
    format: "image/jpeg",
    quality: 0.9,
    scale: 1,
    keywords: ["convert png to jpg", "png to jpg online", "png to jpeg"],
    steps: [
      "Choose or drag in one or more PNG images.",
      "Set your preferred JPG quality and select Convert to JPG.",
      "Check the resulting sizes and download each JPG.",
    ],
    paragraphs: [
      "Convert PNG images to JPG with a simple browser-based workflow. Select one file or a group, adjust the quality, and create downloadable JPEG images without installing software or uploading your photos. JPG is widely accepted by websites, email clients, forms, and image services. The batch queue keeps the source name and resulting size visible, helping you choose a good balance between file size and image quality before downloading.",
      "PNG can store transparency and exact pixel values, while JPG uses lossy compression and cannot store transparent pixels. To create a predictable JPG, transparent PNG areas are filled with white before encoding. This matters for logos or icons with see-through backgrounds: the converted image will have a solid white backdrop. If transparency is important, keep your PNG or choose a format that supports it, such as WebP or PNG.",
      "JPG works especially well for photographs and complex images with many colors, where its compression can significantly reduce file size. Its quality setting trades smaller output for more visible compression artifacts. Higher quality preserves more visual detail and usually yields a larger file; lower quality can save space but may soften edges or create block patterns. The exact output depends on the image content and your browser's JPEG encoder, so inspect the downloaded result at its intended display size.",
      "All decoding and encoding runs locally using browser FileReader, canvas, and the native image encoder. PixelKit does not receive your selected images. Files up to 25 MB are accepted, with output dimensions bounded to avoid excessive memory use. The tool reports original and converted sizes after encoding, so you can judge the actual savings rather than rely on a prediction. PNG to JPG changes both format and, when the quality is below maximum, image data.",
    ],
    comparison:
      "JPG often makes photographs much smaller using lossy compression, but it discards some image information and has no transparency. PNG preserves transparency and lossless data but is often larger for photos.",
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG Converter",
    shortName: "SVG to PNG",
    title: "Free SVG to PNG Converter — High-Resolution & Private",
    description:
      "Rasterize SVG vector graphics to high-resolution PNG online. Choose an output scale and convert privately on your device.",
    formats: ["SVG", "PNG"],
    accepts: "image/svg+xml,.svg",
    format: "image/png",
    quality: 1,
    scale: 2,
    keywords: ["convert svg to png", "svg to png online", "rasterize svg"],
    steps: [
      "Select an SVG file or drop it into the conversion area.",
      "Choose your output scale for a larger, sharper PNG.",
      "Convert and download the rasterized image.",
    ],
    paragraphs: [
      "Convert a vector SVG into a PNG image directly in your web browser. SVG artwork scales cleanly because it describes shapes rather than a fixed pixel grid. PNG is useful when a destination only accepts raster images, such as many forms, messaging apps, and older graphics programs. PixelKit lets you choose an output scale so you can create a larger PNG for high-density displays or a compact image for previews, without installing a desktop converter.",
      "SVG files are parsed locally and passed through a conservative cleanup before rasterization. The converter removes scripts and embedded foreign content, rejects document type declarations, and strips external resource references. This protects the rendering workflow and means the result contains the vector drawing rather than instructions that load outside content. Not every advanced SVG feature, external font, or linked image will be preserved; SVGs that depend on external assets may therefore look different from the original.",
      "Choose a scale according to the intended use. A 1× output uses the SVG's intrinsic dimensions, while 2× doubles both width and height and produces four times as many pixels. Larger output can look sharper when displayed on high-density screens, but it also uses more memory and increases file size. Outputs are capped at 12,000 pixels on the longest edge, and each selected file is limited to 25 MB to keep processing practical in a browser.",
      "PNG preserves transparent backgrounds, which makes it a natural choice for icons, logos, diagrams, and UI artwork. Unlike SVG, however, PNG is raster: once exported, it cannot be enlarged indefinitely without visible softness. Keep the original SVG whenever you may need to change colors or resize the artwork later. The converted file is created with HTML canvas and a browser image encoder; your source remains on your device throughout the process.",
    ],
    comparison:
      "SVG stays sharp at any vector display size and is usually compact for simple artwork. PNG is a fixed-size raster image with broad compatibility and transparency, but enlarging it can make edges look soft.",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortName: "Image Compressor",
    title: "Free Image Compressor — Reduce Image Size Privately",
    description:
      "Compress JPG and WebP images in your browser. Fine-tune quality and dimensions, compare file sizes, and download privately.",
    formats: ["JPG", "PNG", "WEBP"],
    accepts: "image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp",
    format: "image/webp",
    quality: 0.8,
    scale: 1,
    compression: true,
    keywords: ["compress image online", "image compressor", "reduce image file size"],
    steps: [
      "Add JPG, PNG, or WebP images to the compression queue.",
      "Adjust the quality and dimensions to suit your needs.",
      "Compare the actual file sizes, then download the compressed images.",
    ],
    paragraphs: [
      "Reduce image file size without sending photos to an upload service. PixelKit compresses JPG, PNG, and WebP images on your device using the browser's native canvas encoder. Add several images at once, select an output format, adjust quality and scale, and compare each original with its newly encoded result. The size difference is calculated from the actual output file, not an estimate, so you can decide whether a setting provides worthwhile savings for your image.",
      "Image compression has two distinct levers. Quality controls how much visual information a lossy encoder discards: lower values usually produce smaller JPG and WebP files, but they can also create blur, banding, or block artifacts. Scale changes the pixel dimensions themselves. Reducing both width and height to 75%, for example, results in roughly 56% as many pixels. Resizing can deliver large savings when an image is much larger than its intended display, but it also reduces available detail if the image is enlarged again.",
      "PNG uses lossless encoding and does not apply a lossy quality setting, so choosing a lower quality does not make a PNG smaller through this tool. Select JPG or WebP if you need quality-based compression; note that JPG cannot preserve transparency and transparent pixels are rendered over white. WebP supports transparency and often offers smaller outputs, but confirm that your target platform accepts it. Compression outcomes vary because photographs, screenshots, gradients, and simple illustrations contain different visual information.",
      "Processing runs only while this page is open and files are selected; there is no server upload or server-side image processing. Each file may be up to 25 MB, output dimensions are capped to protect browser memory, and a busy device may take longer with large batches. Compare the preview and saved percentage, then keep the original if you need an untouched source. Reprocessing after changing quality or scale produces new measured output sizes using the updated settings.",
    ],
    comparison:
      "Lossy JPG and WebP quality settings can produce meaningful size savings but may reduce visible detail. PNG remains lossless and ignores the quality slider; reducing its dimensions or choosing another format is more effective.",
  },
  {
    slug: "word-to-pdf",
    name: "Word & Text to PDF Converter",
    shortName: "Word to PDF",
    title: "Free Word to PDF Converter — Private & Browser-Based",
    description:
      "Convert DOCX, TXT, RTF, and Markdown files to PDF directly in your browser with layout, images, and tables preserved.",
    formats: ["DOCX", "TXT", "RTF", "MD"],
    accepts:
      ".docx,.txt,.rtf,.md,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    format: "image/png",
    quality: 1,
    scale: 1,
    keywords: [
      "word to pdf",
      "docx to pdf",
      "text to pdf",
      "convert document to pdf",
    ],
    steps: [
      "Select a DOCX, TXT, RTF, or Markdown file from your device.",
      "The tool parses formatting, inline pictures, and tables into an A4 PDF layout.",
      "Download the print-ready PDF generated directly in your browser.",
    ],
    paragraphs: [
      "Convert Word documents and text files to PDF without uploading them to a remote server. Select a DOCX, TXT, RTF, or Markdown file, and PixelKit renders a clean, downloadable PDF directly on your local device.",
      "DOCX files are converted directly in your browser while preserving typography, headings, tables, bulleted lists, and embedded images into a standard A4 PDF document. Plain text, RTF, and Markdown files are formatted cleanly with readable spacing. Your original files never leave your device.",
      "PDF is ideal for sharing and archiving because it preserves visual consistency across laptops, phones, and operating systems without requiring desktop office software. All processing takes place locally via client-side rendering.",
      "Review the downloaded PDF in your preferred viewer. Because all rendering happens inside your browser without backend processing, your confidential documents remain strictly private.",
    ],
    comparison:
      "DOCX and text files are easily editable, whereas PDF preserves presentation across platforms. This converter renders Word headings, tables, styles, and embedded pictures into a standardized A4 document directly in your browser.",
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    shortName: "PDF Compressor",
    title: "Free PDF Compressor — Reduce Size Privately",
    description:
      "Compress PDF files locally by downsampling pages and embedded images. No document uploads required.",
    formats: ["PDF"],
    accepts: ".pdf,application/pdf",
    format: "image/png",
    quality: 1,
    scale: 1,
    compression: true,
    keywords: ["pdf compressor", "compress pdf", "reduce pdf size"],
    steps: [
      "Select a PDF file from your device.",
      "PixelKit downsamples pages and recompresses internal imagery locally.",
      "Compare original and optimized file sizes, then download your compressed PDF.",
    ],
    paragraphs: [
      "Compress large PDF documents in your browser without uploading confidential files to third-party servers. PixelKit processes each page directly on your device, ensuring privacy and fast results.",
      "PixelKit compresses PDFs by downsampling visual elements and re-encoding page content using optimized compression algorithms right in your browser. This substantially reduces file size for image-heavy documents and scanned files without uploading them.",
      "Compare the original and output sizes immediately after compression. The tool provides a clean trade-off between compact file weight and readable document clarity, making it easy to share via email or web portals.",
      "Processing runs completely within your web browser using local resources. Once you close the tab or clear your queue, memory is instantly reclaimed.",
    ],
    comparison:
      "Standard PDF re-saving only cleans document metadata, but true compression downsamples high-resolution visual layers and embedded scans to cut file sizes by up to 70% while keeping text readable.",
  },
];

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixelkit-olive.vercel.app";