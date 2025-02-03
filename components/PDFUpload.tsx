import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
interface PDFUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
const PDFUpload = ({ files, setFiles }: PDFUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
    setError(null); // Xóa lỗi trước đó
    if (rejectedFiles.length > 0) {
      setError("Chỉ chấp nhận tệp PDF");
      return;
    }
    setFiles(acceptedFiles); // Cập nhật danh sách tệp được tải lên
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] }, // Chỉ chấp nhận tệp PDF
    multiple: false, // Chỉ cho phép tải lên một tệp
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: () => setError("Tệp quá lớn, giới hạn dưới 5MB"),
  });

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Kéo thả tệp PDF vào đây...</p>
        ) : (
          <p>Kéo thả hoặc nhấp để chọn tệp PDF</p>
        )}
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4">
        {files.map((file, index) => (
          <div key={index} className="border p-2 rounded-md">
            <p className="font-semibold">{file.name}</p>
            <p>Kích thước: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFUpload;
