"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, ArrowLeft, Clock, CheckCircle2, Hash, 
  FileText, Trash2, Copy, Loader2, AlertTriangle
} from "lucide-react";
import { useParams } from "next/navigation";

interface EvidenceDetail {
  id: string;
  title: string;
  type: string;
  description: string | null;
  file_url: string | null;
  content_hash: string;
  captured_at: string;
  timestamped_at: string | null;
  verified: boolean;
}

export default function EvidenceDetailPage() {
  const params = useParams();
  const [evidence, setEvidence] = useState<EvidenceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchEvidence(token);
  }, [params.id]);

  const fetchEvidence = async (token: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/evidence/${params.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvidence(data);
      } else if (response.status === 404) {
        setError("Evidence not found");
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Failed to load evidence");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/evidence/${params.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Failed to delete evidence");
      }
    } catch (err) {
      setError("Failed to delete evidence");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const copyHash = () => {
    if (evidence?.content_hash) {
      navigator.clipboard.writeText(evidence.content_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goBack = () => {
    window.location.href = "/dashboard";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error || !evidence) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{error || "Evidence not found"}</h2>
          <button
            onClick={goBack}
            className="text-teal-500 hover:text-teal-600 font-medium text-sm sm:text-base"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={goBack} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl transition">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-800 hidden sm:block">Evidence Details</span>
              <span className="text-lg font-bold text-slate-800 sm:hidden">Details</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-xl transition text-sm sm:text-base"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden">
              {evidence.file_url && evidence.type === "photo" ? (
                <img 
                  src={evidence.file_url} 
                  alt={evidence.title}
                  className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain bg-slate-100"
                />
              ) : (
                <div className="h-48 sm:h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Title & Description */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{evidence.title}</h1>
                  <span className="inline-block mt-2 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded-full text-xs sm:text-sm capitalize">
                    {evidence.type}
                  </span>
                </div>
                {evidence.verified && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-teal-50 text-teal-600 rounded-full flex-shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
              
              {evidence.description && (
                <p className="text-sm sm:text-base text-slate-600">{evidence.description}</p>
              )}
            </div>

            {/* Cryptographic Proof */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Cryptographic Proof</h3>
                  <p className="text-white/60 text-xs sm:text-sm">SHA-256 Hash</p>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg sm:rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm break-all">
                {evidence.content_hash}
              </div>
              
              <button
                onClick={copyHash}
                className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition text-xs sm:text-sm"
              >
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {copied ? "Copied!" : "Copy Hash"}
              </button>
              
              <p className="mt-3 sm:mt-4 text-white/60 text-xs sm:text-sm">
                This unique fingerprint proves the file has not been modified since it was captured.
              </p>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
              <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                Timestamp Information
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-0.5 sm:mb-1">Captured At</p>
                  <p className="font-medium text-slate-900 text-sm sm:text-base">
                    {formatDate(evidence.captured_at)}
                  </p>
                </div>
                
                {evidence.timestamped_at && (
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-0.5 sm:mb-1">Timestamped At</p>
                    <p className="font-medium text-slate-900 text-sm sm:text-base">
                      {formatDate(evidence.timestamped_at)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-teal-50 rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm text-teal-700">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                  This evidence has been cryptographically timestamped and cannot be backdated.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-2">Delete Evidence?</h3>
            <p className="text-sm sm:text-base text-slate-600 text-center mb-5 sm:mb-6">
              This action cannot be undone. The evidence and its cryptographic proof will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}