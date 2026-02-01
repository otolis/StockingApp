"use client";

import Link from "next/link";
import { Package, ArrowRight, Shield, BarChart3, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Hero animations on load
    animate('.hero-badge', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutExpo',
      delay: 200,
    });

    animate('.hero-title span', {
      opacity: [0, 1],
      translateY: [60, 0],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: stagger(150, { start: 400 }),
    });

    animate('.hero-description', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo',
      delay: 900,
    });

    animate('.hero-buttons a', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo',
      delay: stagger(100, { start: 1100 }),
    });

    // Scroll-triggered animations for features
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate('.feature-card', {
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.95, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: stagger(150),
          });
          featureObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate('.footer-content > *', {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: stagger(100),
          });
          footerObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (featuresRef.current) featureObserver.observe(featuresRef.current);
    if (footerRef.current) footerObserver.observe(footerRef.current);

    return () => {
      featureObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 bg-black/80 backdrop-blur-md border-b-2 border-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Package className="text-[#FFB800] w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
            <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">Nexus Stock</span>
          </div>
          <Link href="/login" className="px-4 py-2 md:px-6 md:py-2.5 border-2 border-white text-white text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main ref={heroRef} className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32 relative">
        <div className="space-y-8 md:space-y-12">
          <div className="hero-badge opacity-0 inline-flex items-center gap-3 px-4 py-1.5 border-2 border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] text-[10px] font-black uppercase tracking-[0.2em]">
            Now in Beta
          </div>

          <h1 className="hero-title text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
            <span className="block opacity-0">Inventory</span>
            <span className="block opacity-0 text-stroke-2 text-transparent" style={{ WebkitTextStroke: '2px currentColor' } as any}>Management</span>
            <span className="block opacity-0 text-[#FFB800]">Perfected.</span>
          </h1>

          <p className="hero-description opacity-0 max-w-2xl text-base md:text-lg font-medium leading-relaxed opacity-70">
            Nexus Stock provides real-time oversight of your inventory levels, smart alerts, and automated audit trails. Simple, powerful, and designed for modern teams.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <Link
              href="/login"
              className="opacity-0 w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 border-4 border-white bg-white text-black text-base md:text-lg font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(255,184,0,1)] md:shadow-[10px_10px_0px_rgba(255,184,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group"
            >
              Get Started
              <ArrowRight className="group-hover:translate-x-2 transition" />
            </Link>
            <Link
              href="/about"
              className="opacity-0 w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 border-4 border-white bg-transparent text-white text-base md:text-lg font-black uppercase tracking-widest hover:bg-white/5 transition text-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div ref={featuresRef} className="mt-24 md:mt-48 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="feature-card opacity-0 border-2 border-white p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/20">
              <span className="text-[10px] text-white/60 uppercase">Feature 01</span>
              <BarChart3 size={16} className="opacity-60" />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Real-Time Sync</h3>
            <p className="text-sm opacity-60 leading-relaxed">
              Monitor your stock levels in real-time across your entire organization with instant synchronization.
            </p>
          </div>

          <div className="feature-card opacity-0 border-2 border-[#FFB800] p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#FFB800]/40 bg-[#FFB800] -mx-6 -mt-6 px-6 py-4 text-black font-bold">
              <span className="text-[10px] uppercase">Feature 02</span>
              <Zap size={16} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Smart Alerts</h3>
            <p className="text-sm opacity-60 leading-relaxed">
              Get notified when stock levels drop below thresholds. Never miss a restocking opportunity.
            </p>
          </div>

          <div className="feature-card opacity-0 border-2 border-[#00FFC2] p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#00FFC2]/40 bg-[#00FFC2] -mx-6 -mt-6 px-6 py-4 text-black font-bold">
              <span className="text-[10px] uppercase">Feature 03</span>
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
      <footer ref={footerRef} className="mt-20 md:mt-32 border-t-2 border-white py-12">
        <div className="footer-content max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="opacity-0 flex items-center gap-3">
            <Package size={24} className="text-[#FFB800]" />
            <span className="font-black uppercase tracking-widest">Nexus Stock</span>
          </div>
          <div className="opacity-0 text-[10px] md:text-xs uppercase tracking-widest opacity-60">
            © 2026 Nexus Stock. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
