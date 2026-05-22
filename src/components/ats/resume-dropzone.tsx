"use client";

import { useMemo, useRef, useState } from "react";
import { FileUp, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type UploadFileState = {
  name: string;
  status: "queued" | "uploading" | "done" | "skipped" | "error";
  message?: string;
};

export function ResumeDropzone({ jobId }: { jobId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<UploadFileState[]>([]);
  const [summary, setSummary] = useState<{ processed: number; skipped: number } | null>(null);

  const statusText = useMemo(() => {
    if (uploading) {
      return `Uploading ${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"}...`;
    }

    if (summary) {
      return `${summary.processed} processed, ${summary.skipped} skipped`;
    }

    if (selectedFiles.length) {
      return `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} ready`;
    }

    return "Upload PDF, DOC, or DOCX files in bulk.";
  }, [selectedFiles.length, summary, uploading]);

  function queueFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? []);
    setSelectedFiles(nextFiles);
    setSummary(null);
    setUploadProgress(0);
    setItems(nextFiles.map((file) => ({ name: file.name, status: "queued" })));
  }

  async function handleUpload() {
    if (!selectedFiles.length || uploading) return;

    setUploading(true);
    setUploadProgress(0);
    setItems(selectedFiles.map((file) => ({ name: file.name, status: "uploading" })));

    await new Promise<void>((resolve) => {
      const formData = new FormData();
      for (const file of selectedFiles) {
        formData.append("files", file);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/jobs/${jobId}/resumes`);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      };

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText || "{}");
          const processed = Array.isArray(response.processed) ? response.processed : [];
          const skipped = Array.isArray(response.skipped) ? response.skipped : [];
          setSummary({ processed: processed.length, skipped: skipped.length });
          setItems((current) =>
            current.map((file) => {
              const isSkipped = skipped.some((entry: { file?: string }) => entry.file === file.name);
              return {
                ...file,
                status: isSkipped ? "skipped" : "done",
                message: isSkipped ? "Duplicate resume detected" : "Uploaded and scored"
              };
            })
          );
        } catch {
          setItems((current) => current.map((file) => ({ ...file, status: "error", message: "Upload failed" })));
        } finally {
          setUploading(false);
          resolve();
        }
      };

      xhr.onerror = () => {
        setItems((current) => current.map((file) => ({ ...file, status: "error", message: "Upload failed" })));
        setUploading(false);
        resolve();
      };

      xhr.send(formData);
    });
  }

  return (
    <Card className="border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50">
      <CardContent className="flex min-h-[360px] flex-col gap-5 p-8 text-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-glow">
            <FileUp className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Drop Resumes Here</h3>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Upload PDF, DOC, or DOCX files in bulk. The system uploads to Cloudinary, extracts text locally, generates embeddings, and scores each candidate against the selected JD.
            </p>
          </div>
          <Button type="button" className="rounded-xl" onClick={() => inputRef.current?.click()}>
            <UploadCloud className="h-4 w-4" /> Browse Files
          </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          aria-label="Upload resumes"
          title="Upload resumes"
          className="hidden"
          onChange={(event) => queueFiles(event.target.files)}
        />

          <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 10MB each</p>
          <p className="text-sm font-medium text-slate-700">{statusText}</p>

          {selectedFiles.length > 0 ? (
            <Button type="button" className="rounded-xl" disabled={uploading} onClick={() => void handleUpload()}>
              {uploading ? "Uploading..." : "Upload Resumes"}
            </Button>
          ) : null}

          {uploading || summary ? (
            <div className="w-full max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-left">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Upload progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
              {items.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.message ?? item.status}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.15em] text-slate-500">{item.status}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {summary ? <p className="text-xs text-slate-500">{summary.processed} uploaded, {summary.skipped} skipped as duplicates.</p> : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
