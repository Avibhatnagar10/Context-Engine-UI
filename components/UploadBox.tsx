"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function UploadBox() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload", formData);
      alert("Context Synced.");
    } catch {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-white/5 rounded-2xl hover:border-white/20 transition-all group">
      <label className="cursor-pointer block text-center">
        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
          {loading ? "Processing..." : "Drop context files (.pdf, .txt)"}
        </span>
        <input type="file" className="hidden" onChange={handleUpload} disabled={loading} />
      </label>
    </div>
  );
}