"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
  onUploadReady?: (uploadFn: (propertyId?: string) => Promise<string[]>) => void;
}

export default function PhotoUpload({ photos, onPhotosChange, maxPhotos = 10, onUploadReady }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviews(photos);
  }, [photos]);

  useEffect(() => {
    if (onUploadReady) {
      onUploadReady(uploadPhotos);
    }
  }, [selectedFiles, photos, onUploadReady]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxPhotos - (photos.length + selectedFiles.length);
    
    if (files.length > remainingSlots) {
      alert(`Vous ne pouvez ajouter que ${remainingSlots} photo(s) supplémentaire(s) (maximum ${maxPhotos} photos)`);
      return;
    }

    const newFiles = files.slice(0, remainingSlots);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviews((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removePhoto(index: number) {
    const isExistingPhoto = index < photos.length;
    
    if (isExistingPhoto) {
      const newPhotos = photos.filter((_, i) => i !== index);
      onPhotosChange(newPhotos);
    } else {
      const fileIndex = index - photos.length;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function movePhotoUp(index: number) {
    if (index === 0) return;
    const newPreviews = [...previews];
    [newPreviews[index - 1], newPreviews[index]] = [newPreviews[index], newPreviews[index - 1]];
    setPreviews(newPreviews);
    
    if (index <= photos.length) {
      const newPhotos = [...photos];
      if (index < photos.length) {
        [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
        onPhotosChange(newPhotos);
      }
    }
  }

  function movePhotoDown(index: number) {
    if (index === previews.length - 1) return;
    const newPreviews = [...previews];
    [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
    setPreviews(newPreviews);
    
    if (index < photos.length) {
      const newPhotos = [...photos];
      if (index + 1 < photos.length) {
        [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
        onPhotosChange(newPhotos);
      }
    }
  }

  async function uploadPhotos(propertyId?: string): Promise<string[]> {
    if (selectedFiles.length === 0) {
      return photos;
    }

    setUploading(true);
    const supabase = supabaseBrowser();
    const uploadedUrls: string[] = [...photos];

    try {
      for (const file of selectedFiles) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = propertyId ? `${propertyId}/${fileName}` : `temp/${fileName}`;

        const { data, error } = await supabase.storage
          .from("property-photos")
          .upload(filePath, file);

        if (error) {
          throw new Error(`Erreur lors de l'upload: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from("property-photos")
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      setSelectedFiles([]);
      setPreviews(uploadedUrls);
      onPhotosChange(uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  }

  const canAddMore = photos.length + selectedFiles.length < maxPhotos;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-800 mb-2">
          Photos ({photos.length + selectedFiles.length}/{maxPhotos})
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={!canAddMore || uploading}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className={`inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 cursor-pointer ${
            !canAddMore || uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Upload en cours..." : "Sélectionner des photos"}
        </label>
        {!canAddMore && (
          <p className="mt-1 text-xs text-zinc-500">Maximum {maxPhotos} photos atteint</p>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-zinc-200">
                <Image
                  src={preview}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                    Principale
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => movePhotoUp(index)}
                  disabled={index === 0}
                  className="p-2 bg-white rounded text-zinc-700 disabled:opacity-50"
                  aria-label="Déplacer vers le haut"
                >
                  ↑
                </button>
                <button
                  onClick={() => removePhoto(index)}
                  className="p-2 bg-red-600 rounded text-white"
                  aria-label="Supprimer"
                >
                  ×
                </button>
                <button
                  onClick={() => movePhotoDown(index)}
                  disabled={index === previews.length - 1}
                  className="p-2 bg-white rounded text-zinc-700 disabled:opacity-50"
                  aria-label="Déplacer vers le bas"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && (
        <p className="text-sm text-zinc-500">Aucune photo sélectionnée. La première photo sera la photo principale.</p>
      )}
    </div>
  );
}
