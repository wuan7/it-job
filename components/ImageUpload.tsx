"use client"
import { X } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";

interface ImageUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  loading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ files, setFiles, loading }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Chỉ lấy file đầu tiên
    if (file) {
      setFiles([file]); // Chỉ cho phép 1 file
    }
  }, [setFiles]);

  const handleRemoveFile = () => {
    setFiles([]); // Xóa file khỏi state
  };

  return (
    <div className="space-y-4">
     
      
      {files.length > 0 ? (
        <div className="relative w-40">
          <Image 
            src={URL.createObjectURL(files[0])} 
            alt="Preview" 
            className="w-36 h-36 object-contain rounded-md border" 
            width={50}
            height={50}
          />
          <button 
            onClick={handleRemoveFile} 
            className="absolute top-1 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-sm"
            disabled={loading}
          >
            <X />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center h-32 w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer" >
          <span className="text-gray-500">Nhấn để tải lên ảnh</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
