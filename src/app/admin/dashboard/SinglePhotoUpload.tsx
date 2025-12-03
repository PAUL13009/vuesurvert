"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

interface SinglePhotoUploadProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
  onUploadReady?: (uploadFn: (collaboratorId?: string) => Promise<string>) => void;
}

export default function SinglePhotoUpload({ photoUrl, onPhotoChange, onUploadReady }: SinglePhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(photoUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    if (onUploadReady) {
      onUploadReady(uploadPhoto);
    }
  }, [selectedFile, photoUrl, onUploadReady]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onPhotoChange(result); // Mise à jour immédiate pour l'aperçu
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removePhoto() {
    setSelectedFile(null);
    setPreview("");
    onPhotoChange("");
  }

  async function uploadPhoto(collaboratorId?: string): Promise<string> {
    if (!selectedFile) {
      return photoUrl;
    }

    setUploading(true);
    const supabase = supabaseBrowser();
    let finalUrl = photoUrl;

    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = collaboratorId ? `collaborators/${collaboratorId}/${fileName}` : `collaborators/temp/${fileName}`;

      const { data, error } = await supabase.storage
        .from("property-photos")
        .upload(filePath, selectedFile);

      if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("property-photos")
        .getPublicUrl(data.path);

      finalUrl = publicUrl;
      setPreview(publicUrl);
      onPhotoChange(publicUrl);
      setSelectedFile(null);
      return publicUrl;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-2">
          Photo du collaborateur
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="collaborator-photo-upload"
        />
        <label
          htmlFor="collaborator-photo-upload"
          className={`inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Upload en cours..." : preview ? "Changer la photo" : "Sélectionner une photo"}
        </label>
      </div>

      {preview && (
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-200 group">
          <Image
            src={preview}
            alt="Photo du collaborateur"
            fill
            className="object-cover"
            sizes="128px"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={removePhoto}
              className="p-2 bg-red-600 rounded text-white"
              aria-label="Supprimer la photo"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {!preview && (
        <p className="text-sm text-zinc-500">Aucune photo sélectionnée.</p>
      )}
    </div>
  );
}

