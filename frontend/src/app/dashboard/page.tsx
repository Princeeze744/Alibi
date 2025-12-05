"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Search, Filter, Plus, Clock, CheckCircle2, 
  Image, FileText, Receipt, MapPin,
  ChevronDown, LogOut, TrendingUp,
  Calendar, Scale, Loader2, Menu, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface EvidenceItem {
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

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filters = [
    { id: "all", label: "All", icon: Filter },
    { id: "photo", label: "Photos", icon: Image },
    { id: "document", label: "Documents", icon: FileText },
    { id: "receipt", label: "Receipts", icon: Receipt },
    { id: "note", label: "Notes", icon: MapPin },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchEvidence(token);
  }, [router]);

  const fetchEvidence = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/evidence", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvidence(data.items || []);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch evidence:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const goToUpload = () => {
    window.location.href = "/upload";
  };

  const goToEvidence = (id: string) => {
    window.location.href = `/evidence/${id}`;
  };

  const filteredEvidence = evidence.filter(item => {
    if (activeFilter !== "all" && item.type !== activeFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalEvidence: evidence.length,
    verifiedForCourt: evidence.filter(e => e.verified).length,
    thisMonth: evidence.filter(e => {
      const date = new Date(e.captured_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo": return "📷";
      case "document": return "📄";
      case "receipt": return "🧾";
      case "note": return "📝";
      default: return "📁";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4 sm:p-6 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Close button for mobile */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div 
          onClick={() => router.push("/dashboard")} 
          className="flex items-center gap-3 mb-8 sm:mb-10 cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-800">Alibi</span>
        </div>

        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 rounded-xl text-sm sm:text-base"
          />
        </div>

        <nav className="space-y-1 flex-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all text-sm sm:text-base ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <filter.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">{filter.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition-all text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">Alibi</span>
          </div>
          <button 
            onClick={goToUpload}
            className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Evidence Library</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage and view your documented evidence</p>
          </div>
          <button 
            onClick={goToUpload}
            className="inline-flex items-center px-4 sm:px-6 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all cursor-pointer text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            New Evidence
          </button>
        </div>

        {/* Mobile Title */}
        <div className="lg:hidden mb-4">
          <h1 className="text-xl font-bold text-slate-900">Evidence Library</h1>
        </div>

        {/* Mobile Filter Pills - NEW! */}
        <div className="lg:hidden mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600"
                }`}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Search - NEW! */}
        <div className="lg:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search evidence..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 rounded-xl text-sm h-10"
            />
          </div>
        </div>

        {/* Stats Cards - Horizontal scroll on mobile */}
        <div className="flex lg:hidden gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-4 min-w-[140px]">
            <p className="text-xs text-slate-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalEvidence}</p>
          </div>
          <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-4 min-w-[140px]">
            <p className="text-xs text-slate-500 mb-1">Verified</p>
            <p className="text-2xl font-bold text-teal-500">{stats.verifiedForCourt}</p>
          </div>
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl p-4 min-w-[140px]">
            <p className="text-xs text-white/70 mb-1">This Month</p>
            <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Evidence</h2>
              <button className="flex items-center gap-1 sm:gap-2 text-slate-600 hover:text-slate-900 text-sm sm:text-base">
                <span>Sort by Date</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filteredEvidence.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => goToEvidence(item.id)}
                    className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
                  >
                    <div className="h-32 sm:h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                      {item.file_url && item.type === "photo" ? (
                        <img 
                          src={item.file_url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl sm:text-5xl">{getTypeIcon(item.type)}</span>
                      )}
                      {item.verified && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
                        <span className="text-[10px] sm:text-xs text-slate-600">{getTimeAgo(item.captured_at)}</span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-slate-900 mb-1 truncate text-sm sm:text-base">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-slate-500 capitalize">{item.type}</span>
                        {item.verified && (
                          <div className="flex items-center gap-1 text-teal-600">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && filteredEvidence.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">No evidence found</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4">
                  {evidence.length === 0 
                    ? "Start by uploading your first evidence" 
                    : "Try adjusting your search or filters"}
                </p>
                {evidence.length === 0 && (
                  <button 
                    onClick={goToUpload}
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Evidence
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Stats - Hidden on mobile */}
          <div className="hidden lg:block space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-medium">Evidence Captured</h3>
                <div className="flex items-center gap-1 text-teal-500">
                  <TrendingUp className="w-4 h-4" />
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-slate-900">{stats.totalEvidence}</span>
                <span className="text-teal-500 font-medium mb-2">Total</span>
              </div>
              <div className="flex items-end gap-1 mt-4 h-12">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-teal-500 to-teal-400 rounded-sm"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-600 font-medium">Verified</h3>
                <Scale className="w-5 h-5 text-teal-500" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-slate-900">{stats.verifiedForCourt}</span>
                <div className="flex items-center gap-1 text-teal-500 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/80 font-medium">This Month</h3>
                <Calendar className="w-5 h-5 text-white/80" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold">{stats.thisMonth}</span>
                <span className="text-white/80 font-medium mb-2">new items</span>
              </div>
              <p className="text-white/60 text-sm mt-2">Keep documenting your life!</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}