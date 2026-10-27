export type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export type ConversionOptions = {
  format: OutputFormat;
  quality: number;
  scale: number;
  maxDimension?: number;
};

export type ConversionResult = {
  blob: Blob;
  width: number;
  height: number;
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("This file could not be read as an image."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("The browser could not read this file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This file is not a supported or valid image."));
    image.src = src;
  });
}

function sanitizedSvgFile(file: File): Promise<Blob> {
  return file.text().then((text) => {
    if (/<!DOCTYPE|<!ENTITY/i.test(text)) {
      throw new Error("SVG files with document type declarations are not supported.");
    }
    const document = new DOMParser().parseFromString(text, "image/svg+xml");
    const svg = document.documentElement;
    if (svg.tagName.toLowerCase() !== "svg" || document.querySelector("parsererror")) {
      throw new Error("This file does not contain valid SVG markup.");
    }
    document.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
    document.querySelectorAll("*").forEach((node) => {
      for (const attribute of Array.from(node.attributes)) {
        if (/^on/i.test(attribute.name)) {
          node.removeAttribute(attribute.name);
        }
        if ((attribute.name === "href" || attribute.name.endsWith(":href")) &&
            !attribute.value.startsWith("#") &&
            !attribute.value.startsWith("data:image/")) {
          node.removeAttribute(attribute.name);
        }
      }
    });
    return new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml",
    });
  });
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Your browser could not export this image. Try a different format."));
          return;
        }
        resolve(blob);
      },
      format,
      format === "image/png" ? undefined : Math.min(1, Math.max(0.1, quality)),
    );
  });
}

export async function convertImage(
  file: File,
  options: ConversionOptions,
): Promise<ConversionResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Files must be 25 MB or smaller.");
  }
  const isSvg = file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
  if (!isSvg && !file.type.startsWith("image/")) {
    throw new Error("Choose a valid image file.");
  }

  let sourceUrl: string | undefined;
  try {
    let source: string;
    if (isSvg) {
      sourceUrl = URL.createObjectURL(await sanitizedSvgFile(file));
      source = sourceUrl;
    } else {
      source = await readFile(file);
    }
    const image = await loadImage(source);
    const scale = Math.min(4, Math.max(0.1, options.scale));
    const maxDimension = options.maxDimension ?? 12000;
    const limit = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale * limit));
    const height = Math.max(1, Math.round(image.naturalHeight * scale * limit));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the image canvas.");
    if (options.format === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    return { blob: await canvasBlob(canvas, options.format, options.quality), width, height };
  } finally {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function outputName(filename: string, format: OutputFormat): string {
  const extension = format === "image/jpeg" ? "jpg" : format.split("/")[1];
  return `${filename.replace(/\.[^.]+$/, "")}.${extension}`;
}
