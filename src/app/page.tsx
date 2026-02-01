"use client";

import Link from "next/link";
import { Package, ArrowRight, Shield, BarChart3, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="mainGridCanvas font-mono text-black dark:text-white transition-colors duration-300">
      {/* Navigation Node */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 bg-[#F7F5F0]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b-4 border-black dark:border-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-[#FFB800]" size={32} strokeWidth={3} />
            <span className="text-2xl font-black uppercase tracking-tighter">NXS_STOCK</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest hover:text-[#FFB800] transition">
              AUTH_GATEWAY
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 border-2 border-black dark:border-white bg-[#00FFC2] text-black text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:translate-y-0.5 active:translate-y-1 transition"
            >
              INITIALIZE_NODE
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-48 pb-32 relative">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border-2 border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] text-[10px] font-black uppercase tracking-[0.2em]">
            SYSTEM_STATUS: [BETA_RELEASE]
          </div>

          <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black dark:text-white">
            INVENTORY <br />
            <span className="text-stroke-2 text-transparent" style={{ WebkitTextStroke: '2px currentColor' }}>ORCHESTRATION</span><br />
            <span className="text-[#FFB800]">PERFECTED.</span>
          </h1>

          <p className="max-w-2xl text-lg font-bold uppercase tracking-tight opacity-70 leading-snug">
            Nexus Stock provides real-time oversight of your inventory levels, smart intent-based alerts, and automated audit trails. Modular architecture. Intent-driven UI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-lg font-black uppercase tracking-widest shadow-[10px_10px_0px_rgba(255,184,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group"
            >
              SPAWN_DASHBOARD
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 border-4 border-black dark:border-white bg-transparent text-black dark:text-white text-lg font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              RUN_SIMULATION
            </Link>
          </div>
        </div>

        {/* Features Preview Node */}
        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="tactileNode">
            <div className="nodeHeader">
              <span>MODULE_01</span>
              <BarChart3 size={16} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">REAL_TIME_ORCHESTRATION</h3>
            <p className="text-xs font-bold uppercase opacity-60 leading-relaxed">
              Monitor your stock levels in real-time across your entire organization with sub-second synchronization.
            </p>
          </div>

          <div className="tactileNode border-[#FFB800]">
            <div className="nodeHeader bg-[#FFB800] text-black border-[#FFB800]">
              <span>MODULE_02</span>
              <Zap size={16} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">SMART_INTENT_ALERTS</h3>
            <p className="text-xs font-bold uppercase opacity-60 leading-relaxed">
              The orchestration layer generates functional widgets based on restocking priorities. Never miss a volume threshold.
            </p>
          </div>

          <div className="tactileNode border-[#00FFC2]">
            <div className="nodeHeader bg-[#00FFC2] text-black border-[#00FFC2]">
              <span>MODULE_03</span>
              <Shield size={16} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">AUDIT_LEDGER_INTEGRITY</h3>
            <p className="text-xs font-bold uppercase opacity-60 leading-relaxed">
              Automated history logging captures every state change, ensuring your inventory records are always pristine and auditable.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Node */}
      <footer className="mt-32 border-t-4 border-black dark:border-white py-12 bg-black dark:bg-white text-white dark:text-black">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Package size={24} />
            <span className="font-black uppercase tracking-widest">NXS_STOCK_2026</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
            &copy; NEXUS_STOCK_SAAS. ACCESS_RESTRICTED. ALL_RIGHTS_RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
