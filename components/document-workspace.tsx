"use client";

import { useState } from "react";
import { ArrowDownToLine, Check, FileText, LoaderCircle, Sparkles, Upload, X } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { compressPdf, convertWordOrTextToPdf } from "@/lib/document-tools";
import { formatBytes } from "@/lib/imageConverter";
import type { ToolDefinition } from "@/lib/tools";

type DocumentEntry = {
  id: string;
  file: File;
  result?: Blob;
  status: "ready" | "processing" | "done" | "error";
  error?: string;
};

const MAX_FILES = 20;
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export function DocumentWorkspace({ tool }: { tool: ToolDefinition }) {
  const [entries, setEntries] = useState<DocumentEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const wordTool = tool.slug === "word-to-pdf";

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files);
    const accepted = incoming.filter((file) =>
      file.size <= MAX_FILE_SIZE &&
      tool.accepts.split(",").some((accept) => accept.startsWith(".")
        ? file.name.toLowerCase().endsWith(accept.toLowerCase())
        : file.type === accept),
    );
    const available = MAX_FILES - entries.length;
    const added = accepted.slice(0, Math.max(0, available)).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "ready" as const,
    }));
    setEntries((current) => [...current, ...added]);
    setError(
      incoming.length !== accepted.length
        ? "Some files were skipped. Check the supported file types and the 25 MB per-file limit."
        : accepted.length > available
          ? `Only ${Math.max(0, available)} more files fit in this batch.`
          : "",
    );
  };

  const processFiles = async () => {
    if (busy || entries.length === 0) return;
    setBusy(true);
    setError("");

    for (const entry of entries) {
      if (entry.status === "done") continue;
      setEntries((current) => current.map((item) =>
        item.id === entry.id ? { ...item, status: "processing", error: undefined } : item,
      ));

      try {
        const result = wordTool
          ? await convertWordOrTextToPdf(entry.file)
          : await compressPdf(entry.file);
        setEntries((current) => current.map((item) =>
          item.id === entry.id ? { ...item, result, status: "done" } : item,
        ));
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "The document could not be processed.";
        setEntries((current) => current.map((item) =>
          item.id === entry.id ? { ...item, status: "error", error: message } : item,
        ));
      }
    }

    setBusy(false);
  };

  const download = (entry: DocumentEntry) => {
    if (!entry.result) return;
    const url = URL.createObjectURL(entry.result);
    const link = document.createElement("a");
    const baseName = entry.file.name.replace(/\.[^.]+$/, "");
    link.href = url;
    link.download = `${baseName}${wordTool ? "" : "-compressed"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="tool-wrap" aria-label={`${tool.shortName} tool`}>
      <div className="tool-card">
        <div className="tool-card-head">
          <strong>{tool.name}</strong>
          <span className="supported">Supports {tool.formats.join(", ")}</span>
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
            className="sr-only"
            type="file"
            accept={tool.accepts}
            multiple
            onChange={(event) => {
              if (event.currentTarget.files) addFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
            aria-label={`Select files for ${tool.shortName}`}
          />
          <span className="upload-icon"><Upload size={22} /></span>
          <strong>{dragging ? "Drop your documents here" : "Choose or drop your documents here"}</strong>
          <p>Files are processed locally in your browser</p>
          <span className="browse-button"><FileText size={14} /> Choose files</span>
          <small>Up to 20 files · 25 MB per file · Nothing is uploaded</small>
        </label>
        {error ? <p className="error-message" role="alert">{error}</p> : null}
        {entries.length > 0 ? (
          <>
            <div className="queue-head">
              <div><strong>Document queue</strong><span className="queue-subtitle">{entries.length} file{entries.length === 1 ? "" : "s"}</span></div>
              <button type="button" className="text-button" onClick={() => { setEntries([]); setError(""); }}>Clear all</button>
            </div>
            <ul className="queue-list" aria-live="polite" aria-label="Document processing results">
              {entries.map((entry) => (
                <li className="queue-item" key={entry.id}>
                  <span className="preview-placeholder"><FileText size={18} /></span>
                  <div className="file-info">
                    <div className="file-name" title={entry.file.name}>{entry.file.name}</div>
                    <div className="file-size">
                      {formatBytes(entry.file.size)}
                      {entry.result ? ` → ${formatBytes(entry.result.size)}` : ""}
                    </div>
                  </div>
                  <div className="file-result">
                    <span className="format-badge">PDF</span>
                    <span className={`status-text${entry.status === "done" ? " success" : entry.status === "error" ? " error" : ""}`}>
                      {entry.status === "processing" ? "Processing…" : entry.status === "done" ? <><Check size={11} /> Ready</> : entry.status === "error" ? entry.error : "Waiting"}
                    </span>
                    {entry.status === "done" ? (
                      <button className="text-button" type="button" onClick={() => download(entry)}>Download</button>
                    ) : null}
                  </div>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))}
                    disabled={busy}
                    aria-label={`Remove ${entry.file.name}`}
                  ><X size={15} /></button>
                </li>
              ))}
            </ul>
            <div className="tool-actions">
              <span className="action-note">{busy ? "Processing documents on your device…" : "Your original files are never changed."}</span>
              <div className="button-group">
                <button type="button" className="primary-button" onClick={() => void processFiles()} disabled={busy}>
                  {busy ? <LoaderCircle className="spin" size={15} /> : <Sparkles size={14} />}
                  {busy ? "Processing…" : wordTool ? "Convert to PDF" : "Compress PDF"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => entries.filter((entry) => entry.status === "done").forEach(download)}
                  disabled={busy || !entries.some((entry) => entry.status === "done")}
                ><ArrowDownToLine size={14} /> Download all</button>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <p className="privacy-note">Documents are processed locally in your browser and never sent to a server.</p>
      <AdSlot size="rectangle" />
    </section>
  );
}
