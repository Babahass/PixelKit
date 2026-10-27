import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as mammoth from "mammoth";

export async function convertWordOrTextToPdf(file: File): Promise<Blob> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return createPdfFromText(result.value || "The selected document was empty.");
  }

  if (/\.(txt|rtf|md)$/i.test(name) || file.type.startsWith("text/")) {
    return createPdfFromText(await file.text());
  }

  throw new Error("Use a .txt, .rtf, .md, or .docx file for conversion.");
}

export async function compressPdf(file: File): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const bytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });
  return new Blob([bytes], { type: "application/pdf" });
}

async function createPdfFromText(text: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const lines = wrapText(text || "No text found in this file.", 78);
  let y = 780;

  for (const line of lines) {
    if (y < 50) {
      const nextPage = pdfDoc.addPage([595.28, 841.89]);
      y = 780;
      nextPage.drawText(line, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 18;
      continue;
    }

    page.drawText(line, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 18;
  }

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

function wrapText(input: string, maxCharsPerLine: number): string[] {
  const cleaned = input.replace(/\r/g, "").trim() || "No text found in this file.";
  const words = cleaned.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length <= maxCharsPerLine) {
      current = `${current} ${word}`.trim();
      continue;
    }

    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
}
