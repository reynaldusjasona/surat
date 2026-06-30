"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Upload, X, Check, Loader2, Camera, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SelectedFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
}

const MAX_SIZE_MB = 10;
const MAX_FILES = 20;

export default function UploadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const roleFromUrl = searchParams.get("role") === "photographer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [asPhotographer, setAsPhotographer] = useState(roleFromUrl);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const valid = newFiles.filter((f) => {
        if (!f.type.startsWith("image/")) {
          toast.error(`${f.name}: not an image`);
          return false;
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
          toast.error(`${f.name}: exceeds ${MAX_SIZE_MB}MB`);
          return false;
        }
        return true;
      });

      const remaining = MAX_FILES - files.length;
      if (valid.length > remaining) {
        toast.warning(`Only ${remaining} more photos allowed (max ${MAX_FILES})`);
      }

      const toAdd = valid.slice(0, remaining).map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
        status: "pending" as const,
      }));

      setFiles((prev) => [...prev, ...toAdd]);
    },
    [files.length]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  }

  function removeFile(i: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, j) => j !== i);
    });
  }

  async function handleUpload() {
    if (!name || !email) {
      toast.error("Please enter your name and email");
      return;
    }
    if (files.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }

    setUploading(true);
    let uploaded = 0;

    for (let i = 0; i < files.length; i++) {
      setFiles((prev) =>
        prev.map((f, j) => (j === i ? { ...f, status: "uploading" } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);
        formData.append("uploaderName", name);
        formData.append("uploaderEmail", email);
        formData.append("isPhotographer", String(asPhotographer));

        const res = await fetch(`/api/events/${slug}/photos/upload`, {
          method: "POST",
          body: formData,
        });

        setFiles((prev) =>
          prev.map((f, j) =>
            j === i ? { ...f, status: res.ok ? "done" : "error" } : f
          )
        );
        if (res.ok) uploaded++;
      } catch {
        setFiles((prev) =>
          prev.map((f, j) => (j === i ? { ...f, status: "error" } : f))
        );
      }
    }

    setUploading(false);
    if (uploaded > 0) {
      toast.success(`${uploaded} photo${uploaded > 1 ? "s" : ""} uploaded!`);
      setDone(true);
    }
  }

  if (done) {
    const count = files.filter((f) => f.status === "done").length;
    return (
      <div className="min-h-screen bg-surat-beige-50 flex items-center justify-center p-4">
        <div className="card p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl text-surat-neutral-900 mb-2">Photos uploaded!</h1>
          <p className="text-sm text-surat-neutral-500 mb-6">
            {count} photo{count > 1 ? "s" : ""} added to the gallery.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setFiles([]);
                setDone(false);
              }}
              className="btn-secondary w-full"
            >
              Upload more
            </button>
            <Link href={`/${slug}`} className="btn-ghost w-full text-surat-neutral-600">
              Back to event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surat-beige-50">
      {/* Header */}
      <header className="px-5 py-4 bg-white border-b border-surat-neutral-200">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href={`/${slug}`}
            className="text-sm text-surat-neutral-500 hover:text-surat-neutral-700"
          >
            ← Back to event
          </Link>
          <span className="font-serif text-base text-surat-red-500 font-semibold">Surat</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-surat-neutral-900">Upload Photos</h1>
          <p className="text-sm text-surat-neutral-500 mt-1">
            Share your memories from this event
          </p>
        </div>

        {/* Details */}
        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Your name *</label>
              <input
                className="input"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                className="input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <label
            className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-surat-beige-50 border border-surat-beige-200 hover:bg-surat-beige-100 transition-colors"
            onClick={() => setAsPhotographer(!asPhotographer)}
          >
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                asPhotographer
                  ? "bg-surat-red-500 border-surat-red-500"
                  : "border-surat-neutral-300 bg-white"
              )}
            >
              {asPhotographer && <Check size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium text-surat-neutral-800 flex items-center gap-1.5">
                <Camera size={14} className="text-surat-red-400" /> I&apos;m the photographer
              </p>
              <p className="text-xs text-surat-neutral-400">
                Your photos will be marked as professional
              </p>
            </div>
          </label>
        </div>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "card border-2 border-dashed cursor-pointer transition-all p-8 text-center",
            files.length === 0
              ? "border-surat-beige-300 hover:border-surat-red-300 hover:bg-surat-red-50/30"
              : "border-surat-neutral-200"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
          />
          <div className="w-12 h-12 rounded-xl bg-surat-beige-100 flex items-center justify-center mx-auto mb-3">
            <ImageIcon size={22} className="text-surat-neutral-400" />
          </div>
          <p className="text-sm font-medium text-surat-neutral-700">
            Drop photos here or click to browse
          </p>
          <p className="text-xs text-surat-neutral-400 mt-1">
            Max {MAX_SIZE_MB}MB per photo · Up to {MAX_FILES} photos
          </p>
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-surat-neutral-700">
              {files.length} photo{files.length > 1 ? "s" : ""} selected
            </p>
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-surat-beige-100 group"
                >
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  {f.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                  {f.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                  )}
                  {f.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                      <X size={20} className="text-white" />
                    </div>
                  )}
                  {f.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
              {files.length < MAX_FILES && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="aspect-square rounded-lg border-2 border-dashed border-surat-neutral-200 flex items-center justify-center text-surat-neutral-300 hover:border-surat-neutral-300 hover:text-surat-neutral-400 transition-colors"
                >
                  <Upload size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0 || !name || !email}
          className="btn-primary w-full"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload {files.length > 0 ? `${files.length} ` : ""}Photos
            </>
          )}
        </button>
      </main>
    </div>
  );
}
