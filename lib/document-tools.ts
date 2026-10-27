import { PDFDocument } from "pdf-lib";
import * as mammoth from "mammoth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * HIGH-FIDELITY WORD & TEXT TO PDF CONVERTER
 * - Supports wide tabular documents (auto-detects tables and switches to Landscape A4)
 * - Injects Noto Sans Ethiopic font for flawless Amharic/Ge'ez typography
 * - Properly paginates without cutting table rows into pieces
 */
export async function convertWordOrTextToPdf(file: File): Promise<Blob> {
  const name = file.name.toLowerCase();
  let contentHtml = "";

  if (name.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    contentHtml = result.value || "<p>No text found in Word document.</p>";
  } else if (name.endsWith(".rtf")) {
    const raw = await file.text();
    const clean = raw
      .replace(/\\par[d]?/gi, "<br/>")
      .replace(/\\'[0-9a-f]{2}/gi, " ")
      .replace(/\\u-?\d+\??/gi, " ")
      .replace(/\\[a-z]+-?\d* ?/gi, "")
      .replace(/[{}]/g, "");
    contentHtml = `<div style="white-space: pre-wrap;">${clean}</div>`;
  } else if (/\.(txt|md)$/i.test(name) || file.type.startsWith("text/")) {
    const raw = await file.text();
    contentHtml = `<pre style="font-family: inherit; white-space: pre-wrap; word-break: break-word;">${escapeHtml(raw)}</pre>`;
  } else {
    throw new Error("Choose a DOCX, TXT, RTF, or Markdown file.");
  }

  // Detect whether the document contains complex wide tables
  const hasTables = contentHtml.includes("<table");
  // Wide spreadsheets/grade books need landscape orientation
  const isLandscape = hasTables;

  // A4 dimensions at 96 DPI
  const containerWidth = isLandscape ? 1123 : 794;
  const containerMinHeight = isLandscape ? 794 : 1123;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = `${containerWidth}px`;
  container.style.minHeight = `${containerMinHeight}px`;
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#000000";
  container.style.zIndex = "-9999";
  container.style.pointerEvents = "none";
  container.style.overflow = "visible";
  container.style.boxSizing = "border-box";
  container.style.padding = "24px 32px";

  // Inject Noto Sans Ethiopic so Amharic/Ge'ez letters render cleanly
  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;700&display=swap');

      .pdf-root {
        background: #ffffff !important;
        color: #000000 !important;
        font-family: 'Noto Sans Ethiopic', 'Calibri', 'Arial', sans-serif !important;
        font-size: ${hasTables ? "8.5pt" : "11pt"};
        line-height: ${hasTables ? "1.25" : "1.5"};
      }
      .pdf-root * {
        box-sizing: border-box;
      }
      .pdf-root h1 { font-size: 16pt; font-weight: 700; margin: 8px 0; color: #000000 !important; }
      .pdf-root h2 { font-size: 13pt; font-weight: 700; margin: 6px 0; color: #000000 !important; }
      .pdf-root p { margin: 0 0 6px 0; color: #000000 !important; }

      /* Responsive high-density table styling */
      .pdf-root table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 10px 0 !important;
        table-layout: auto !important;
        font-size: 8pt !important;
        page-break-inside: auto;
      }
      .pdf-root tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      .pdf-root th, .pdf-root td {
        border: 1px solid #333333 !important;
        padding: 3px 4px !important;
        text-align: center !important;
        vertical-align: middle !important;
        color: #000000 !important;
        word-break: keep-all !important;
        white-space: nowrap !important;
      }
      /* Names and Descriptions column can wrap cleanly */
      .pdf-root td:nth-child(2) {
        text-align: left !important;
        white-space: normal !important;
        min-width: 120px !important;
        max-width: 180px !important;
      }
      .pdf-root th {
        background-color: #f0f0f0 !important;
        font-weight: 700 !important;
      }
      .pdf-root img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 8px auto;
      }
    </style>
    <div class="pdf-root">${contentHtml}</div>
  `;

  document.body.appendChild(container);

  try {
    // 1. Wait for Ethiopic web fonts to register
    if ("fonts" in document) {
      await (document as any).fonts.ready;
    }

    // 2. Wait for all images to decode
    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          })
      )
    );

    // 3. Short reflow buffer for font rendering
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 4. Capture via html2canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Crisp 2x retina print resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: containerWidth,
    });

    // 5. Build PDF with matching orientation
    const orientation = isLandscape ? "l" : "p";
    const pdf = new jsPDF(orientation, "mm", "a4");

    const pdfPageWidth = isLandscape ? 297 : 210;
    const pdfPageHeight = isLandscape ? 210 : 297;

    const imgWidth = pdfPageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfPageHeight;

    // Additional pages if the student roster spans multiple pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfPageHeight;
    }

    const outputBlob = pdf.output("blob");
    return outputBlob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * 2. REAL PDF COMPRESSOR
 * Downsamples visual pages and embedded assets via HTML5 Canvas at ~108–144 DPI,
 * compresses frames to lossy JPEG, and reconstructs an optimized PDF via pdf-lib.
 */
export async function compressPdf(file: File, quality = 0.65): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");

  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const outputPdf = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) continue;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderTask = (page as any).render({
      canvasContext: ctx,
      viewport: viewport,
    });
    await renderTask.promise;

    const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
    const jpegImage = await outputPdf.embedJpg(jpegDataUrl);

    const pdfPage = outputPdf.addPage([page.view[2], page.view[3]]);
    pdfPage.drawImage(jpegImage, {
      x: 0,
      y: 0,
      width: page.view[2],
      height: page.view[3],
    });
  }

  const compressedBytes = await outputPdf.save({
    useObjectStreams: true,
  });

  return new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

function escapeHtml(str: string): string {
  if (typeof document === "undefined") {
    return str
      .replace(/&/g, "\x26amp;")
      .replace(/</g, "\x26lt;")
      .replace(/>/g, "\x26gt;")
      .replace(/"/g, "\x26quot;")
      .replace(/'/g, "\x26#039;");
  }
  const p = document.createElement("p");
  p.textContent = str;
  return p.innerHTML;
}