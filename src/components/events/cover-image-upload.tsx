"use client";

import { useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be under 5MB");
        return;
      }

      setUploading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error } = await supabase.storage
          .from("events")
          .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("events")
          .getPublicUrl(filePath);

        onChange(data.publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed transition-colors ${
        dragOver
          ? "border-gray-900 bg-gray-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      {value ? (
        <div className="relative aspect-video">
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-600 font-medium">
            {uploading ? "Uploading..." : "Drop image here or click to upload"}
          </span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
