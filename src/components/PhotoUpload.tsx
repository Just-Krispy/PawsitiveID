"use client";

import { useState, useRef, useCallback } from "react";

interface PhotoUploadProps {
  onPhotoSelected: (file: File, preview: string) => void;
}

export default function PhotoUpload({ onPhotoSelected }: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onPhotoSelected(file, dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onPhotoSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      {!preview ? (
        <div
          className={`upload-zone p-12 text-center cursor-pointer ${
            dragOver ? "drag-over" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-6xl mb-4">
            <svg className="mx-auto w-16 h-16 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-orange-300 mb-2">
            Drop a photo of the dog here
          </p>
          <p className="text-sm text-gray-400 mb-4">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, or HEIC - the clearer the photo, the better the match
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src={preview}
            alt="Uploaded dog photo"
            className="w-full max-h-96 object-cover"
          />
          <button
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
