"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@/components/ui";

export default function UploadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const roleFromQuery = searchParams.get("role") || "guest";

  const [step, setStep] = useState<"identify" | "select" | "uploading" | "done">("identify");
  const [identity, setIdentity] = useState({ name: "", email: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploaderId, setUploaderId] = useState("");

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    // For simplicity, use a generated ID. In production, you'd look up or create a user.
    setUploaderId(crypto.randomUUID());
    setStep("select");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 20) {
      alert("Maximum 20 photos per upload");
      return;
    }
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setStep("uploading");
    setProgress(0);

    const formData = new FormData();
    formData.append("uploaderId", uploaderId);
    formData.append("uploaderRole", roleFromQuery);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`/api/events/${slug}/photos/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.data) {
        setUploadedCount(json.data.length);
        setProgress(100);
        setStep("done");
      } else {
        alert(json.error?.message || "Upload failed");
        setStep("select");
      }
    } catch {
      alert("Upload failed. Please try again.");
      setStep("select");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <span className="text-4xl">📸</span>
          <h1 className="text-xl font-bold text-gray-900 mt-2">Upload Photos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {roleFromQuery === "photographer" ? "Photographer upload" : "Share your photos from the event"}
          </p>
        </div>

        {/* Step 1: Identify */}
        {step === "identify" && (
          <form onSubmit={handleIdentify} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upload-name">Your Name</Label>
              <Input
                id="upload-name"
                required
                placeholder="Your name"
                value={identity.name}
                onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload-email">Your Email</Label>
              <Input
                id="upload-email"
                type="email"
                required
                placeholder="your@email.com"
                value={identity.email}
                onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        )}

        {/* Step 2: Select Files */}
        {step === "select" && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Hi {identity.name}! Select photos to upload (max 20).
            </p>

            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                <span className="text-3xl">📷</span>
                <p className="text-sm text-gray-600 mt-2">
                  {files.length > 0
                    ? `${files.length} photo${files.length > 1 ? "s" : ""} selected`
                    : "Tap to select photos"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {files.length > 0 && (
              <>
                {/* Preview grid */}
                <div className="grid grid-cols-4 gap-2">
                  {files.slice(0, 8).map((file, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {files.length > 8 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-gray-500">+{files.length - 8}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={handleUpload}>
                  Upload {files.length} Photo{files.length > 1 ? "s" : ""}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Uploading */}
        {step === "uploading" && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4 text-center">
            <span className="text-3xl">⏳</span>
            <p className="font-medium text-gray-900">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress || 50}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">Please don&apos;t close this page</p>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4 text-center">
            <span className="text-4xl">✅</span>
            <h2 className="text-lg font-semibold text-gray-900">Upload Complete!</h2>
            <p className="text-sm text-gray-600">
              {uploadedCount} photo{uploadedCount > 1 ? "s" : ""} uploaded successfully.
            </p>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  setFiles([]);
                  setStep("select");
                }}
              >
                Upload More
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.close()}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
