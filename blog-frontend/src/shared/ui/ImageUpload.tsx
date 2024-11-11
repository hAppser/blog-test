import { useRef, useState } from "react";
import { convertFileToBase64 } from "@/shared/utils/convertImageToBase64";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (file: string) => void;
  label: string;
  imageBase64?: string | null;
  width?: number;
  height?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  label,
  imageBase64,
  width = 400,
  height = 400,
}) => {
  const [preview, setPreview] = useState<string | null>(imageBase64 || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const base64 = await convertFileToBase64(file);
      setPreview(base64);
      onImageUpload(base64);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        className={`flex flex-col gap-4 p-4 rounded-lg cursor-pointer dark:bg-gray-900 hover:border-gray-400 border-2 border-dashed "
      `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-full h-full flex flex-col items-center">
          {preview ? (
            <Image
              src={preview}
              alt={label}
              className="object-cover rounded"
              width={width}
              height={height}
            />
          ) : (
            <div className="text-gray-500 flex items-center justify-center">
              Drag and drop or click to upload an image
            </div>
          )}
        </div>
      </div>
      <div>
        <input
          className="hidden sr-only invisible"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleFileUpload(e.target.files[0])
          }
        />
      </div>
    </>
  );
};
export default ImageUpload;
