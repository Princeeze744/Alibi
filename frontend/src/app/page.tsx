"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Lock, ChevronRight, FileCheck, Scale, Camera, CheckCircle2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30 overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-slate-800">Alibi</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-slate-600 hover:text-slate-900 transition font-medium">Features</a>
          <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition font-medium">How it Works</a>
          <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition font-medium">Pricing</a>
        </div>
        
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button onClick={() => goTo("/login")} variant="ghost" className="text-slate-600 font-medium">Log in</Button>
          <Button onClick={() => goTo("/register")} className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full px-6 shadow-lg shadow-blue-500/25">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-4 py-4"
        >
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-slate-600 font-medium py-2">Features</a>
            <a href="#how-it-works" className="text-slate-600 font-medium py-2">How it Works</a>
            <a href="#pricing" className="text-slate-600 font-medium py-2">Pricing</a>
            <hr className="border-slate-200" />
            <button onClick={() => goTo("/login")} className="text-slate-600 font-medium py-2 text-left">Log in</button>
            <button 
              onClick={() => goTo("/register")}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full py-3 font-medium"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 shadow-sm">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
              <span className="text-xs sm:text-sm font-medium text-slate-600">Trusted by 10,000+ users</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Start Capturing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500">
                Evidence
              </span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Document your life with cryptographic proof. Photos, receipts, and documents 
              timestamped and verified — ready when you need them.
            </p>
            
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => goTo("/register")}
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Start Capturing Evidence
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg border-slate-300 hover:bg-white/50">
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-600">Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-600">RFC 3161 Timestamps</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup (Hidden on small mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center hidden sm:flex"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
            
            {/* Floating Phone */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Phone Frame */}
              <div className="relative w-[260px] sm:w-[300px] md:w-[340px] lg:w-[360px]">
                <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl shadow-slate-900/30">
                  <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
                    {/* Phone Notch */}
                    <div className="bg-slate-900 h-5 sm:h-7 rounded-b-xl sm:rounded-b-2xl mx-auto w-24 sm:w-32 relative -top-1"></div>
                    
                    {/* Phone Status Bar */}
                    <div className="px-4 sm:px-6 py-1 sm:py-2 flex justify-between items-center -mt-1">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-5 sm:w-6 h-2 sm:h-3 bg-slate-900 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Phone Content */}
                    <div className="px-3 sm:px-5 pb-8 sm:pb-10 pt-1 sm:pt-2 min-h-[380px] sm:min-h-[450px] lg:min-h-[520px] bg-gradient-to-b from-white via-slate-50/50 to-slate-100">
                      {/* Back Arrow */}
                      <div className="mb-3 sm:mb-4">
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 rotate-180" />
                      </div>
                      
                      {/* Receipt Card */}
                      <motion.div 
                        initial={{ rotate: -3 }}
                        animate={{ rotate: [-3, -2, -3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 p-3 sm:p-5 border border-slate-100"
                      >
                        <div className="text-center border-b border-dashed border-slate-200 pb-2 sm:pb-3 mb-3 sm:mb-4">
                          <p className="font-bold text-slate-900 tracking-wider text-sm sm:text-base">TIMESTAMP</p>
                          <p className="text-xs text-teal-500 font-medium">VERIFIED ✓</p>
                        </div>
                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                          <div className="flex justify-between text-slate-600">
                            <span>GROCERY ITEMS</span>
                            <span className="font-medium text-slate-900">$45.99</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>MISC ITEMS</span>
                            <span className="font-medium text-slate-900">$12.50</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-slate-200 pt-2 sm:pt-3 text-slate-900">
                            <span>TOTAL</span>
                            <span>$58.49</span>
                          </div>
                        </div>
                        
                        {/* Verified Badge on Receipt */}
                        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1 sm:gap-2 bg-teal-50 rounded-lg py-1.5 sm:py-2">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
                          <span className="text-xs font-medium text-teal-600">Cryptographically Verified</span>
                        </div>
                      </motion.div>
                      
                      {/* Golden Stopwatch */}
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-16 sm:bottom-24 right-4 sm:right-8"
                      >
                        <div className="relative">
                          {/* Glow */}
                          <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl sm:blur-2xl opacity-40 scale-150"></div>
                          {/* Stopwatch */}
                          <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 rounded-full shadow-xl shadow-amber-500/50 flex items-center justify-center">
                            <Clock className="w-7 h-7 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                          </div>
                          {/* Sparkles */}
                          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg"></div>
                          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-lg"></div>
                        </div>
                      </motion.div>
                      
                      {/* Lock Badge */}
                      <motion.div 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-24 sm:top-32 right-4 sm:right-6 bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 p-2 sm:p-3 border border-slate-100"
                      >
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      </motion.div>
                      
                      {/* Camera Icon */}
                      <motion.div 
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-36 sm:top-44 right-4 sm:right-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-3"
                      >
                        <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 to-teal-100 text-teal-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              Why Choose Alibi?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Professional-grade evidence documentation that holds up when it matters most.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Cryptographic Timestamps</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                RFC 3161 trusted timestamps prove exactly when your evidence was captured. Impossible to backdate or forge.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Court-Ready Exports</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Generate professional evidence packages with verification certificates. Accepted by courts and insurance companies.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 sm:col-span-2 md:col-span-1"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Legal Protection</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Protect yourself in disputes with landlords, insurance companies, employers, contractors, and more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">10K+</div>
              <div className="mt-1 sm:mt-2 text-slate-400 text-sm sm:text-base">Active Users</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">1M+</div>
              <div className="mt-1 sm:mt-2 text-slate-400 text-sm sm:text-base">Evidence Captured</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">99.9%</div>
              <div className="mt-1 sm:mt-2 text-slate-400 text-sm sm:text-base">Uptime</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">$2M+</div>
              <div className="mt-1 sm:mt-2 text-slate-400 text-sm sm:text-base">Claims Won</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              Ready to protect yourself?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10">
              Start documenting your life with cryptographic proof today. Free to get started.
            </p>
            <Button 
              onClick={() => goTo("/register")}
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full px-8 sm:px-10 h-14 sm:h-16 text-lg sm:text-xl shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1"
            >
              Get Started for Free
              <ChevronRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">Alibi</span>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition text-sm sm:text-base">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition text-sm sm:text-base">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition text-sm sm:text-base">Contact</a>
            </div>
            
            <p className="text-slate-400 text-sm sm:text-base">
              © 2024 Alibi. Your Life, Documented.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}