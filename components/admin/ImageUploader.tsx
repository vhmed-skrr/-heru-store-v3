"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/ui/Toast';
import { uploadProductImage, uploadCategoryImage, deleteImage } from '@/lib/storage';

interface ImageUploaderProps {
  maxImages?: number;
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
}

export function ImageUploader({ maxImages = 9, value = [], onChange, bucket = 'product-images' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave" || e.type === "drop") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    if (value.length + files.length > maxImages) {
      toast(`يمكنك رفع ${maxImages} صور كحد أقصى`, "error");
      return;
    }

    const maxFileSize = bucket === 'category-images' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    const sizeErrorMsg = bucket === 'category-images' ? '2MB' : '5MB';

    const validFiles = files.filter(f => {
      if (f.size > maxFileSize) {
        toast(`الملف ${f.name} يتجاوز الحجم المسموح (${sizeErrorMsg})`, "error");
        return false;
      }
      if (!f.type.startsWith('image/')) {
        toast(`الملف ${f.name} ليس صورة صالحة`, "error");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      const uploadRoutine = bucket === 'category-images' ? uploadCategoryImage : uploadProductImage;
      const { url, error } = await uploadRoutine(file);
      
      if (error || !url) {
        toast(`فشل رفع الصورة: ${error}`, "error");
      } else {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls]);
      toast("تم رفع الصور بنجاح", "success");
    }
    
    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = async (index: number) => {
    const urlToRemove = value[index];
    const newItems = [...value];
    newItems.splice(index, 1);
    onChange(newItems);

    // Optional: Attempt to delete from bucket directly
    await deleteImage(urlToRemove);
  };

  return (
    <div className="flex flex-col gap-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group bg-bg-secondary">
              <Image src={url} alt={`صورة ${idx + 1}`} fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < maxImages && (
        <div
          className={`relative flex flex-col items-center justify-center w-full h-32 md:h-48 border-2 border-dashed rounded-xl transition-colors ${dragActive ? 'border-brand-600 bg-brand-50' : 'border-border bg-bg-secondary hover:bg-bg-secondary/80'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-brand-600">
              <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin"></div>
              <p className="font-medium text-sm">جاري الرفع...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-sec text-center px-4 pointer-events-none">
              <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm font-semibold text-text-main">اسحب وأفلت الصور هنا</p>
              <p className="text-xs">أو اضغط لاختيار الملفات (الحد الأقصى {maxImages} صور، 5MB للملف)</p>
            </div>
          )}
          <input 
            ref={inputRef}
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
            multiple={maxImages > 1}
            accept="image/*"
            onChange={handleChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
