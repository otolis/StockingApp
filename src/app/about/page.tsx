"use client";

import Link from "next/link";
import { Package, ArrowLeft, Code, Shield, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function AboutPage() {
    const sectionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Header animations on load
        animate('.about-header > *', {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: stagger(100, { start: 200 }),
        });

        // Scroll-triggered animations for sections
        const observerOptions = {
            root: null,
            rootMargin: '-50px',
            threshold: 0.1,
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target, {
                        opacity: [0, 1],
                        translateY: [40, 0],
                        duration: 800,
                        easing: 'easeOutExpo',
                    });
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.animate-section').forEach((section) => {
            sectionObserver.observe(section);
        });

        // Tech stack list items stagger
        const techObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate('.tech-item', {
                        opacity: [0, 1],
                        translateX: [-20, 0],
                        duration: 600,
                        easing: 'easeOutExpo',
                        delay: stagger(50),
                    });
                    techObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const techSection = document.querySelector('.tech-section');
        if (techSection) techObserver.observe(techSection);

        // Feature cards stagger
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate('.feature-item', {
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        duration: 600,
                        easing: 'easeOutExpo',
                        delay: stagger(100),
                    });
                    featureObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const featureSection = document.querySelector('.feature-section');
        if (featureSection) featureObserver.observe(featureSection);

        // CTA button
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate('.cta-button', {
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 800,
                        easing: 'easeOutElastic(1, 0.5)',
                    });
                    ctaObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) ctaObserver.observe(ctaSection);

        return () => {
            sectionObserver.disconnect();
            techObserver.disconnect();
            featureObserver.disconnect();
            ctaObserver.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden pt-20">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 bg-black/80 backdrop-blur-md border-b-2 border-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition">
                        <Package className="text-[#FFB800] w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                        <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">Nexus Stock</span>
                    </Link>
                    <Link href="/" className="text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-[#FFB800] transition flex items-center gap-2">
                        <ArrowLeft size={14} /> <span className="hidden sm:inline">Back to Home</span>
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main ref={sectionsRef} className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-32">
                <div className="space-y-12 md:space-y-20">
                    {/* Header */}
                    <div className="about-header text-center md:text-left">
                        <h1 className="opacity-0 text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">About</h1>
                        <p className="opacity-0 text-base md:text-lg opacity-70">The precision-engineered operating system for your stock.</p>
                    </div>

                    {/* Project Info */}
                    <section className="animate-section opacity-0 border-2 border-white p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-6 flex items-center gap-3">
                            <Package className="text-[#FFB800]" size={24} />
                            The Vision
                        </h2>
                        <div className="space-y-4 text-sm md:text-base leading-relaxed opacity-80 font-medium">
                            <p>
                                Nexus Stock is a high-performance inventory management system built to handle the complexities of modern logistics with zero friction.
                            </p>
                            <p>
                                We believe that speed and accuracy are the benchmarks of a successful supply chain. Our system is designed to provide absolute visibility into every asset, every move, and every alert.
                            </p>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="animate-section opacity-0 border-2 border-[#FFB800] p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-6 flex items-center gap-3 text-[#FFB800]">
                            <Calendar size={24} />
                            Timeline
                        </h2>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-l-4 border-[#FFB800] pl-6 pb-2">
                                <span className="bg-[#FFB800] text-black px-2 py-0.5 font-black text-xs uppercase">Feb 2026</span>
                                <span className="text-sm md:text-base font-bold uppercase tracking-tight">System Initialization & Core Engine</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-l-4 border-white/20 pl-6 pb-2">
                                <span className="border-2 border-white px-2 py-0.5 font-black text-xs uppercase">Current</span>
                                <span className="text-sm md:text-base opacity-60 font-bold uppercase tracking-tight">Beta Deployment & Optimization</span>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="tech-section animate-section opacity-0 border-2 border-[#00FFC2] p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-8 flex items-center gap-3 text-[#00FFC2]">
                            <Code size={24} />
                            High-Tech Stack
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="font-black uppercase text-xs text-[#00FFC2] tracking-widest">Core Interface</h3>
                                <ul className="space-y-3">
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#00FFC2]" /> Next.js 16 (App Router)
                                    </li>
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#00FFC2]" /> React 19 / TypeScript 5
                                    </li>
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#00FFC2]" /> Tailwind CSS v4
                                    </li>
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#00FFC2]" /> Anime.js v4
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h3 className="font-black uppercase text-xs text-[#FFB800] tracking-widest">Neural Backend</h3>
                                <ul className="space-y-3">
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#FFB800]" /> Firebase v12
                                    </li>
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#FFB800]" /> Cloud Firestore (NoSQL)
                                    </li>
                                    <li className="tech-item opacity-0 flex items-center gap-3 text-xs md:text-sm font-bold uppercase">
                                        <div className="w-2 h-2 bg-[#FFB800]" /> Google Auth v3
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="feature-section animate-section opacity-0 border-2 border-white p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-8 flex items-center gap-3">
                            <Shield size={24} strokeWidth={3} />
                            Key Protocols
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Real-Time Sync', 'Smart Alerts', 'Role Access', 'Encryption'].map((f) => (
                                <div key={f} className="feature-item opacity-0 p-4 border border-white/20 hover:border-[#FFB800] transition group">
                                    <h3 className="font-black uppercase text-xs md:text-sm group-hover:text-[#FFB800] transition">{f}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="cta-section text-center pt-8">
                        <Link
                            href="/login"
                            className="cta-button opacity-0 inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-6 border-4 border-white bg-[#FFB800] text-black text-base md:text-lg font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:shadow-[10px_10px_0px_rgba(0,255,194,1)] hover:bg-[#00FFC2] hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            Open Dashboard
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-white/20 py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <Package size={24} className="text-[#FFB800]" />
                        <span className="font-black uppercase tracking-widest">Nexus Stock</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest opacity-40">
                        © 2026 Nexus Stock. All protocols secured.
                    </div>
                </div>
            </footer>
        </div>
    );
}
