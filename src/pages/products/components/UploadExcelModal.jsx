import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Modal from "@/components/ui/Modal";
import AccentButton from "@/components/ui/AccentButton";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const UploadExcelModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  // Handle dropped file
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  // Upload to backend
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.private.uploadProductsExcel(formData);
      if (res.data.code === "OK") {
        Notification.success("Products uploaded successfully");
        onUploadSuccess(); // Refresh product list
        onClose(); // Close modal
      } else {
        Notification.error(res.data.error || "Upload failed");
      }
    } catch (error) {
      Notification.error("Error uploading file");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Product File (.xlsx or .csv)">
      <div className="space-y-4">
        {/* Drag-and-drop area */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-accent p-6 text-center rounded-lg cursor-pointer bg-accent/5 hover:bg-accent/10 transition"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-accent font-semibold">Drop the file here...</p>
          ) : file ? (
            <p className="text-sm text-gray-700 font-medium">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drag & drop a <strong>.xlsx</strong> or <strong>.csv</strong> file here, or{" "}
              <span className="text-accent font-semibold">click to browse</span>
            </p>
          )}
        </div>

        {/* Upload button */}
        <AccentButton
          text={uploading ? "Uploading..." : "Upload"}
          onClick={handleUpload}
          disabled={!file || uploading}
        />
      </div>
    </Modal>
  );
};

export default UploadExcelModal;
