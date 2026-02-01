"use client";

import Link from "next/link";
import { Package, ArrowLeft, Code, Database, Palette, Shield, Calendar, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white font-mono">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 p-6 bg-black/80 backdrop-blur-md border-b-2 border-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <Package className="text-[#FFB800]" size={32} strokeWidth={3} />
                        <span className="text-2xl font-black uppercase tracking-tighter">Nexus Stock</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-[#FFB800] transition flex items-center gap-2">
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-8 pt-40 pb-32">
                <div className="space-y-16">
                    {/* Header */}
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">About</h1>
                        <p className="text-lg opacity-70">Learn more about Nexus Stock and the technology behind it.</p>
                    </div>

                    {/* Project Info */}
                    <section className="border-2 border-white p-8">
                        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                            <Package className="text-[#FFB800]" size={24} />
                            The Project
                        </h2>
                        <p className="text-sm leading-relaxed opacity-80 mb-4">
                            Nexus Stock is a modern inventory management system designed for small to medium-sized businesses.
                            It provides real-time stock tracking, smart low-stock alerts, and role-based access control to
                            streamline your inventory operations.
                        </p>
                        <p className="text-sm leading-relaxed opacity-80">
                            Built with a focus on simplicity and user experience, Nexus Stock helps teams stay organized
                            and never miss a restocking opportunity.
                        </p>
                    </section>

                    {/* Timeline */}
                    <section className="border-2 border-[#FFB800] p-8">
                        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                            <Calendar className="text-[#FFB800]" size={24} />
                            Project Timeline
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <span className="text-[#FFB800] font-bold text-sm whitespace-nowrap">Feb 2026</span>
                                <span className="text-sm opacity-80">Project initiated and core features developed</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-[#FFB800] font-bold text-sm whitespace-nowrap">Feb 2026</span>
                                <span className="text-sm opacity-80">Beta release with Firebase integration</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-[#FFB800] font-bold text-sm whitespace-nowrap">Current</span>
                                <span className="text-sm opacity-80">Continuous improvements and feature additions</span>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="border-2 border-[#00FFC2] p-8">
                        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                            <Code className="text-[#00FFC2]" size={24} />
                            Technology Stack
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-bold uppercase text-sm text-white/60">Frontend</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#00FFC2]"></span>
                                        Next.js 14 (React Framework)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#00FFC2]"></span>
                                        TypeScript
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#00FFC2]"></span>
                                        Tailwind CSS
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#00FFC2]"></span>
                                        Lucide React (Icons)
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold uppercase text-sm text-white/60">Backend & Services</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#FFB800]"></span>
                                        Firebase Authentication
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#FFB800]"></span>
                                        Cloud Firestore (Database)
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#FFB800]"></span>
                                        Firebase Analytics
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <span className="w-2 h-2 bg-[#FFB800]"></span>
                                        Google Cloud Platform
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="border-2 border-white p-8">
                        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                            <Shield size={24} />
                            Key Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-white/20">
                                <h3 className="font-bold uppercase text-sm mb-2">Real-Time Sync</h3>
                                <p className="text-xs opacity-60">Instant updates across all connected devices</p>
                            </div>
                            <div className="p-4 border border-white/20">
                                <h3 className="font-bold uppercase text-sm mb-2">Smart Alerts</h3>
                                <p className="text-xs opacity-60">Automated low-stock notifications</p>
                            </div>
                            <div className="p-4 border border-white/20">
                                <h3 className="font-bold uppercase text-sm mb-2">Role-Based Access</h3>
                                <p className="text-xs opacity-60">Admin and viewer permission levels</p>
                            </div>
                            <div className="p-4 border border-white/20">
                                <h3 className="font-bold uppercase text-sm mb-2">Google Auth</h3>
                                <p className="text-xs opacity-60">Secure authentication with Google</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-4 px-10 py-5 border-4 border-white bg-[#FFB800] text-black text-lg font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-white py-12">
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
