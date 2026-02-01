"use client";

import Link from "next/link";
import { Package, ArrowRight, Shield, BarChart3, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 bg-black/80 backdrop-blur-md border-b-2 border-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-[#FFB800]" size={32} strokeWidth={3} />
            <span className="text-2xl font-black uppercase tracking-tighter">Nexus Stock</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="px-6 py-2.5 border-2 border-white text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-48 pb-32 relative">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border-2 border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] text-[10px] font-black uppercase tracking-[0.2em]">
            Now in Beta
          </div>

          <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
            Inventory <br />
            <span className="text-stroke-2 text-transparent" style={{ WebkitTextStroke: '2px currentColor' }}>Management</span><br />
            <span className="text-[#FFB800]">Perfected.</span>
          </h1>

          <p className="max-w-2xl text-lg font-medium leading-relaxed opacity-70">
            Nexus Stock provides real-time oversight of your inventory levels, smart alerts, and automated audit trails. Simple, powerful, and designed for modern teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 border-4 border-white bg-white text-black text-lg font-black uppercase tracking-widest shadow-[10px_10px_0px_rgba(255,184,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group"
            >
              Open Dashboard
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-10 py-5 border-4 border-white bg-transparent text-white text-lg font-black uppercase tracking-widest hover:bg-white/5 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-2 border-white p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/20">
              <span className="text-xs text-white/60 uppercase">Feature 01</span>
              <BarChart3 size={16} className="opacity-60" />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Real-Time Sync</h3>
            <p className="text-sm opacity-60 leading-relaxed">
              Monitor your stock levels in real-time across your entire organization with instant synchronization.
            </p>
          </div>

          <div className="border-2 border-[#FFB800] p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#FFB800]/40 bg-[#FFB800] -mx-6 -mt-6 px-6 py-4 text-black">
              <span className="text-xs uppercase font-bold">Feature 02</span>
              <Zap size={16} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Smart Alerts</h3>
            <p className="text-sm opacity-60 leading-relaxed">
              Get notified when stock levels drop below thresholds. Never miss a restocking opportunity.
            </p>
          </div>

          <div className="border-2 border-[#00FFC2] p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#00FFC2]/40 bg-[#00FFC2] -mx-6 -mt-6 px-6 py-4 text-black">
              <span className="text-xs uppercase font-bold">Feature 03</span>
              <Shield size={16} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Audit History</h3>
            <p className="text-sm opacity-60 leading-relaxed">
              Automated logging captures every change, keeping your inventory records accurate and auditable.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t-2 border-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Package size={24} className="text-[#FFB800]" />
            <span className="font-black uppercase tracking-widest">Nexus Stock</span>
          </div>
          <div className="text-xs uppercase tracking-widest opacity-60">
            © 2026 Nexus Stock. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
