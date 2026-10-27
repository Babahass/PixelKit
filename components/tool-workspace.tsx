"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import {
  convertImage,
  formatBytes,
  outputName,
  type OutputFormat,
} from "@/lib/imageConverter";
import type { ToolDefinition } from "@/lib/tools";

type QueueItem = {
  id: string;
  file: File;
  previewUrl: string;
  resultUrl?: string;
  outputSize?: number;
  width?: number;
  height?: number;
  status: "ready" | "processing" | "done" | "error";
  error?: string;
};

const MAX_FILES = 20;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const formats: { value: OutputFormat; label: string }[] = [
  { value: "image/webp", label: "WebP" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
];

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [entries, setEntries] = useState<QueueItem[]>([]);
  const [quality, setQuality] = useState(tool.quality);
  const [scale, setScale] = useState(tool.scale);
  const [format, setFormat] = useState<OutputFormat>(tool.format);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef(entries);
  const settingsRef = useRef({ quality, scale, format });
  const lastSettingsRef = useRef(`${quality}:${scale}:${format}`);
  const objectUrlsRef = useRef(new Set<string>());
  const runIdRef = useRef(0);

  const makeUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    objectUrlsRef.current.add(url);
    return url;
  }, []);

  const releaseUrl = useCallback((url?: string) => {
    if (url && objectUrlsRef.current.delete(url)) URL.revokeObjectURL(url);
  }, []);

  useEffect(() => () => {
    runIdRef.current += 1;
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    entriesRef.current = entries;
    settingsRef.current = { quality, scale, format };
  }, [entries, quality, scale, format]);

  const setQueue = useCallback((next: QueueItem[]) => {
    entriesRef.current = next;
    setEntries(next);
  }, []);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;
    const available = MAX_FILES - entriesRef.current.length;
    if (available <= 0) {
      setError(`You can process up to ${MAX_FILES} images in one batch.`);
      return;
    }
    const accepted = incoming.filter((file) => file.size <= MAX_FILE_SIZE &&
      (file.type.startsWith("image/") || /\.svg$/i.test(file.name)) &&
      fileAcceptsTool(file, tool));
    const rejected = incoming.length - accepted.length;
    const nextEntries = accepted.slice(0, available).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: makeUrl(file),
      status: "ready" as const,
    }));
    setQueue([...entriesRef.current, ...nextEntries]);
    setHasProcessed(false);
    setError(rejected > 0
      ? `${rejected} file${rejected === 1 ? " was" : "s were"} skipped. Choose ${tool.formats[0]} images up to 25 MB each.`
      : incoming.length > available
        ? `Only ${available} more image${available === 1 ? "" : "s"} fit in this batch.`
        : "");
  }, [makeUrl, setQueue, tool]);

  const convertAll = useCallback(async () => {
    const runId = ++runIdRef.current;
    const startingEntries = entriesRef.current;
    if (!startingEntries.length) return;
    setConverting(true);
    setError("");
    const options = { ...settingsRef.current };
    setHasProcessed(true);
    for (const item of startingEntries) {
      if (runId !== runIdRef.current) return;
      setQueue(entriesRef.current.map((entry) => entry.id === item.id
        ? { ...entry, status: "processing", error: undefined }
        : entry));
      try {
        const result = await convertImage(item.file, {
          ...options,
          maxDimension: 12000,
        });
        if (runId !== runIdRef.current) return;
        const resultUrl = makeUrl(result.blob);
        const current = entriesRef.current.find((entry) => entry.id === item.id);
        if (!current) {
          releaseUrl(resultUrl);
          continue;
        }
        releaseUrl(current.resultUrl);
        setQueue(entriesRef.current.map((entry) => entry.id === item.id
          ? {
            ...entry,
            resultUrl,
            outputSize: result.blob.size,
            width: result.width,
            height: result.height,
            status: "done",
            error: undefined,
          }
          : entry));
      } catch (cause) {
        if (runId !== runIdRef.current) return;
        const message = cause instanceof Error ? cause.message : "This image could not be converted.";
        setQueue(entriesRef.current.map((entry) => entry.id === item.id
          ? { ...entry, status: "error", error: message }
          : entry));
      }
    }
    if (runId === runIdRef.current) setConverting(false);
  }, [makeUrl, releaseUrl, setQueue]);

  useEffect(() => {
    const settingsKey = `${quality}:${scale}:${format}`;
    if (settingsKey === lastSettingsRef.current) return;
    lastSettingsRef.current = settingsKey;
    if (!hasProcessed || !entriesRef.current.some((entry) => entry.status === "done")) return;
    const timer = window.setTimeout(() => void convertAll(), 400);
    return () => window.clearTimeout(timer);
  }, [quality, scale, format, hasProcessed, convertAll]);

  const removeEntry = (id: string) => {
    runIdRef.current += 1;
    setConverting(false);
    const removed = entriesRef.current.find((entry) => entry.id === id);
    releaseUrl(removed?.previewUrl);
    releaseUrl(removed?.resultUrl);
    setQueue(entriesRef.current.filter((entry) => entry.id !== id));
  };

  const clearQueue = () => {
    runIdRef.current += 1;
    setConverting(false);
    entriesRef.current.forEach((entry) => {
      releaseUrl(entry.previewUrl);
      releaseUrl(entry.resultUrl);
    });
    setQueue([]);
    setHasProcessed(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const download = (entry: QueueItem) => {
    if (!entry.resultUrl) return;
    const link = document.createElement("a");
    link.href = entry.resultUrl;
    link.download = outputName(entry.file.name, settingsRef.current.format);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAll = () => {
    entriesRef.current.filter((entry) => entry.status === "done")
      .forEach((entry, index) => {
        window.setTimeout(() => download(entry), index * 300);
      });
  };

  const doneCount = entries.filter((entry) => entry.status === "done").length;

  return (
    <section className="tool-wrap" aria-label={`${tool.shortName} tool`}>
      <div className="tool-card">
        <div className="tool-card-head">
          <strong>{tool.name}</strong>
          <span className="supported">Supports {tool.formats.join(" and ")}</span>
        </div>
        <label
          className={`dropzone${dragging ? " is-dragging" : ""}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept={tool.accepts}
            multiple
            onChange={(event) => {
              if (event.currentTarget.files) addFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
            aria-label={`Select ${tool.formats[0]} images`}
          />
          <span className="upload-icon"><Upload size={22} /></span>
          <strong>{dragging ? "Drop your images here" : "Drop your images here"}</strong>
          <p>or browse files from your device</p>
          <span className="browse-button"><ImagePlus size={14} /> Choose images</span>
          <small>Up to 20 files · 25 MB per image · Nothing is uploaded</small>
        </label>
        {tool.compression ? (
          <div className="settings-row">
            <label className="setting">
              <span className="setting-label">Output format
                <select
                  className="format-select"
                  value={format}
                  onChange={(event) => setFormat(event.target.value as OutputFormat)}
                  aria-label="Output image format"
                >
                  {formats.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </span>
            </label>
            <label className="setting">
              <span className="setting-label">Image quality <span>{Math.round(quality * 100)}%</span></span>
              <input type="range" min="0.1" max="1" step="0.05" value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                aria-label="Image quality" aria-valuetext={`${Math.round(quality * 100)} percent`} />
              <span className="quality-hint">Lower quality usually means a smaller file. PNG ignores this setting.</span>
            </label>
            <label className="setting">
              <span className="setting-label">Image scale <span>{Math.round(scale * 100)}%</span></span>
              <input type="range" min="0.25" max="1" step="0.05" value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
                aria-label="Image scale" aria-valuetext={`${Math.round(scale * 100)} percent`} />
            </label>
          </div>
        ) : null}
        {tool.slug === "svg-to-png" ? (
          <div className="settings-row">
            <label className="setting">
              <span className="setting-label">PNG output scale <span>{scale}×</span></span>
              <input type="range" min="1" max="4" step="0.5" value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
                aria-label="PNG output scale" aria-valuetext={`${scale} times the original dimensions`} />
              <span className="quality-hint">Higher scale creates a sharper image with more pixels.</span>
            </label>
          </div>
        ) : null}
        {error ? <p className="error-message" role="alert">{error}</p> : null}
        {entries.length > 0 ? (
          <>
            <div className="queue-head">
              <div><strong>Conversion queue</strong><span className="queue-subtitle">{entries.length} file{entries.length === 1 ? "" : "s"}{doneCount ? ` · ${doneCount} ready` : ""}</span></div>
              <button type="button" className="text-button" onClick={clearQueue}>Clear all</button>
            </div>
            <ul className="queue-list" aria-live="polite" aria-label="Image conversion results">
              {entries.map((entry) => {
                const savings = entry.outputSize === undefined
                  ? null
                  : Math.round((1 - entry.outputSize / entry.file.size) * 100);
                return (
                  <li className="queue-item" key={entry.id}>
                    <img className="preview-image" src={entry.previewUrl} alt="" />
                    <div className="file-info">
                      <div className="file-name" title={entry.file.name}>{entry.file.name}</div>
                      <div className="file-size">
                        {formatBytes(entry.file.size)}
                        {entry.outputSize !== undefined ? ` → ${formatBytes(entry.outputSize)}` : ""}
                        {entry.width && entry.height ? ` · ${entry.width} × ${entry.height}` : ""}
                        {savings !== null && tool.compression ? ` · ${savings >= 0 ? `${savings}% smaller` : `${Math.abs(savings)}% larger`}` : ""}
                      </div>
                    </div>
                    <div className="file-result">
                      <span className="format-badge">{format.split("/")[1].toUpperCase()}</span>
                      <span className={`status-text${entry.status === "done" ? " success" : entry.status === "error" ? " error" : ""}`}>
                        {entry.status === "processing" ? "Processing…" : entry.status === "done" ? <><Check size={11} /> Ready</> : entry.status === "error" ? entry.error : "Waiting"}
                      </span>
                      {entry.status === "done" ? <button className="text-button" type="button" onClick={() => download(entry)} aria-label={`Download ${outputName(entry.file.name, format)}`}>Download</button> : null}
                    </div>
                    <button className="remove-button" type="button" onClick={() => removeEntry(entry.id)} aria-label={`Remove ${entry.file.name}`}><X size={15} /></button>
                  </li>
                );
              })}
            </ul>
            <div className="tool-actions">
              <span className="action-note">{converting ? "Processing images on your device…" : "Your originals are never changed."}</span>
              <div className="button-group">
                <button type="button" className="primary-button" onClick={() => void convertAll()} disabled={converting}>
                  {converting ? <LoaderCircle className="spin" size={15} /> : hasProcessed ? <RefreshCw size={14} /> : <Sparkles size={14} />}
                  {converting ? "Processing…" : hasProcessed ? "Convert again" : `Convert to ${format.split("/")[1].toUpperCase()}`}
                </button>
                <button type="button" className="secondary-button" onClick={downloadAll} disabled={converting || doneCount === 0}>
                  <ArrowDownToLine size={14} /> Download all
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <p className="privacy-note"><LockKeyhole size={12} /> Files are processed locally in your browser and never sent to a server.</p>
      <AdSlot size="rectangle" />
    </section>
  );
}

function fileAcceptsTool(file: File, tool: ToolDefinition): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const expected = tool.accepts.split(",").map((item) => item.trim().replace(/^\./, ""));
  return Boolean(extension && expected.includes(extension)) ||
    expected.some((item) => item.startsWith("image/") && item === file.type);
}
