// @expect P-05 A-04
import { useEffect, useRef, useState } from "react";

type UploadStatus = "idle" | "uploading" | "complete" | "failed";

interface UploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
}

const INITIAL: UploadState = { status: "idle", progress: 0, error: null };

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}

function useUpload(file: File | null, endpoint: string) {
  const [state, setState] = useState<UploadState>(INITIAL);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!file) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "uploading", progress: 0, error: null });

    const body = new FormData();
    body.append("file", file);

    fetch(endpoint, { method: "POST", body, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
        setState({ status: "complete", progress: 100, error: null });
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setState({ status: "failed", progress: 0, error: error.message });
      });

    return () => controller.abort();
  }, [file, endpoint]);

  return state;
}

export interface UploadFieldProps {
  /** Destination the file is posted to. */
  endpoint: string;
  /** Text shown above the drop zone. */
  instructions: string;
  /** Maximum accepted file size in bytes. */
  maxSize?: number;
  /** Called once the upload completes successfully. */
  onComplete?: () => void;
}

/** A drop zone that uploads a single file. */
export function UploadField({
  endpoint,
  instructions,
  maxSize,
  onComplete,
}: UploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const { status, progress, error } = useUpload(file, endpoint);

  useEffect(() => {
    if (status === "complete") onComplete?.();
  }, [status, onComplete]);

  const barColor =
    status === "failed"
      ? "bg-danger-default"
      : status === "complete"
        ? "bg-success-default"
        : "bg-accent-default";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-default p-4">
      <p className="text-sm text-fg-secondary">{instructions}</p>

      <input
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="text-sm"
      />

      {file ? (
        <p className="text-xs text-fg-muted">{formatBytes(file.size)}</p>
      ) : null}

      {maxSize && file && file.size > maxSize ? (
        <p className="text-xs text-danger-default">File is too large.</p>
      ) : null}

      <div className="h-1 w-full rounded-full bg-bg-raised">
        <div
          className={`h-1 rounded-full ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {error ? <p className="text-xs text-fg-secondary">{error}</p> : null}
    </div>
  );
}
