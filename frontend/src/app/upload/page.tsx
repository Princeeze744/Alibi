"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Upload, FileText, Image, X,
  MapPin, Clock, CheckCircle2, ArrowLeft, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "photo",
    description: "",
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, type: "photo" });
    } else {
      setPreview(null);
      setFormData({ ...formData, type: "document" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      uploadData.append("title", formData.title);
      uploadData.append("item_type", formData.type);
      if (formData.description) {
        uploadData.append("description", formData.description);
      }

      const response = await fetch("http://127.0.0.1:8000/evidence/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.detail || "Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Is the backend running?");
    } finally {
      setIsUploading(false);
    }
  };

  const goBack = () => {
    window.location.href = "/dashboard";
  };

  const evidenceTypes = [
    { id: "photo", label: "Photo", icon: Image },
    { id: "document", label: "Document", icon: FileText },
    { id: "receipt", label: "Receipt", icon: FileText },
  ];

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-teal-500/30"
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Evidence Captured!</h2>
          <p className="text-sm sm:text-base text-slate-600 mb-2">Your evidence has been timestamped and verified.</p>
          <div className="flex items-center justify-center gap-2 text-teal-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Cryptographic timestamp applied</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={goBack} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl transition">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-800">New Evidence</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-1">Cryptographic Timestamping</h2>
                <p className="text-white/80 text-sm sm:text-base">
                  Your evidence will be hashed and timestamped using RFC 3161 standards. 
                  This creates an unforgeable proof of when this evidence existed.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* File Upload Area */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Upload File</h3>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? "border-teal-500 bg-teal-50" 
                    : selectedFile
                    ? "border-teal-500 bg-teal-50/50"
                    : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInput}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />

                {selectedFile ? (
                  <div className="space-y-3 sm:space-y-4">
                    {preview ? (
                      <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto rounded-xl overflow-hidden shadow-lg">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreview(null);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900 text-sm sm:text-base">{selectedFile.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-slate-900 mb-1 sm:mb-2">
                      Drop your file here, or tap to browse
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Supports images, PDFs, and documents up to 50MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Evidence Details */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Evidence Details</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-slate-700 font-medium text-sm sm:text-base">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Apartment condition at move-in"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 h-11 sm:h-12 rounded-xl border-slate-200 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Evidence Type */}
                <div>
                  <Label className="text-slate-700 font-medium text-sm sm:text-base">Evidence Type</Label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
                    {evidenceTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                          formData.type === type.id
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <type.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-slate-700 font-medium text-sm sm:text-base">
                    Description (optional)
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Add any relevant notes about this evidence..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full h-20 sm:h-24 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-600">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Location will be captured automatically</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!selectedFile || !formData.title || isUploading}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl text-base sm:text-lg font-medium shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Capturing Evidence...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Capture & Timestamp Evidence
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}