"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Register
      const registerResponse = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (registerResponse.ok) {
        // Auto-login after registration
        const loginResponse = await fetch("http://127.0.0.1:8000/auth/jwt/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: formData.email,
            password: formData.password,
          }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          localStorage.setItem("token", data.access_token);
          router.push("/dashboard");
        }
      } else {
        const data = await registerResponse.json();
        if (data.detail === "REGISTER_USER_ALREADY_EXISTS") {
          setError("An account with this email already exists");
        } else {
          setError(data.detail || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setError("Connection error. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const goTo = (path: string) => {
    window.location.href = path;
  };

  const benefits = [
    "Cryptographic timestamps",
    "Court-ready exports",
    "Bank-level encryption",
    "Unlimited evidence storage",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30 flex flex-col lg:flex-row">
      {/* Mobile decorative header */}
      <div className="lg:hidden bg-gradient-to-br from-blue-500 via-teal-500 to-emerald-500 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Start Protecting Today</h2>
          <p className="text-white/80 text-sm sm:text-base">
            Join 10,000+ users documenting their lives.
          </p>
        </motion.div>
      </div>

      {/* Decorative Section - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 via-teal-500 to-emerald-500 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white max-w-md"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Start Protecting Your Life Today</h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of users who trust Alibi to document and protect their important moments.
          </p>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div 
            onClick={() => goTo("/")} 
            className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">Alibi</span>
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-sm sm:text-base text-slate-600">Start documenting your life with cryptographic proof</p>
          </div>

          {/* Mobile benefits */}
          <div className="lg:hidden mb-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-2 gap-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium text-sm sm:text-base">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 sm:h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm sm:text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 sm:h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 sm:h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 pr-12 text-sm sm:text-base"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">Must be at least 8 characters</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl text-base sm:text-lg font-medium shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-500">
            By creating an account, you agree to our{" "}
            <button onClick={() => goTo("/terms")} className="text-blue-500 hover:text-blue-600">
              Terms of Service
            </button>{" "}
            and{" "}
            <button onClick={() => goTo("/privacy")} className="text-blue-500 hover:text-blue-600">
              Privacy Policy
            </button>
          </p>

          <p className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-slate-600">
            Already have an account?{" "}
            <button 
              onClick={() => goTo("/login")} 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}