import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import * as mammoth from "mammoth";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 50;
const FONT_SIZE = 12;
const LINE_HEIGHT = 18;

export async function convertWordOrTextToPdf(file: File): Promise<Blob> {
  const name = file.name.toLowerCase();
  let text: string;

  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    text = result.value;
  } else if (name.endsWith(".rtf")) {
    text = (await file.text())
      .replace(/\\par[d]?/gi, "\n")
      .replace(/\\'[0-9a-f]{2}/gi, " ")
      .replace(/\\u-?\d+\??/gi, " ")
      .replace(/\\[a-z]+-?\d* ?/gi, "")
      .replace(/[{}]/g, "");
  } else if (/\.(txt|md)$/i.test(name) || file.type.startsWith("text/")) {
    text = await file.text();
  } else {
    throw new Error("Choose a DOCX, TXT, RTF, or Markdown file.");
  }

  return createPdfFromText(text);
}

export async function compressPdf(file: File): Promise<Blob> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const bytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });
  const buffer = new Uint8Array(bytes.length);
  buffer.set(bytes);
  return new Blob([buffer.buffer], { type: "application/pdf" });
}

async function createPdfFromText(text: string): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const safeText = (text || "No text found in this file.")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "?");
  const lines = wrapText(safeText, font);
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - PAGE_MARGIN;

  for (const line of lines) {
    if (y < PAGE_MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - PAGE_MARGIN;
    }

    if (line) {
      page.drawText(line, {
        x: PAGE_MARGIN,
        y,
        size: FONT_SIZE,
        font,
        color: rgb(0, 0, 0),
      });
    }
    y -= LINE_HEIGHT;
  }

  const bytes = await pdf.save();
  const buffer = new Uint8Array(bytes.length);
  buffer.set(bytes);
  return new Blob([buffer.buffer], { type: "application/pdf" });
}

function wrapText(text: string, font: PDFFont): string[] {
  const maxWidth = PAGE_WIDTH - PAGE_MARGIN * 2;
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue;
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, FONT_SIZE) <= maxWidth) {
        line = candidate;
        continue;
      }

      if (line) lines.push(line);
      line = word;
      while (font.widthOfTextAtSize(line, FONT_SIZE) > maxWidth) {
        let splitAt = line.length;
        while (splitAt > 1 && font.widthOfTextAtSize(line.slice(0, splitAt), FONT_SIZE) > maxWidth) {
          splitAt -= 1;
        }
        lines.push(line.slice(0, splitAt));
        line = line.slice(splitAt);
      }
    }
    lines.push(line);
  }

  return lines;
}
