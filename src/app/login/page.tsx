"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const { user, signInWithGoogle, loading, getRedirectPath } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push(getRedirectPath());
        }
    }, [user, loading, router, getRedirectPath]);

    if (loading) {
        return (
            <div className="mainGridCanvas flex h-screen items-center justify-center font-mono">
                <div className="tactileNode animate-pulse">Connecting...</div>
            </div>
        );
    }

    return (
        <div className="mainGridCanvas flex min-h-screen flex-col items-center justify-center p-6 font-mono">
            <div className="w-full max-w-sm mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white bg-black hover:bg-[#A855F7] hover:text-black transition uppercase font-black text-[10px] tracking-widest shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                >
                    <ArrowLeft size={14} strokeWidth={3} /> Back to Home
                </Link>
            </div>
            <div className="tactileNode w-full max-w-sm !p-0 overflow-hidden shadow-[8px_8px_0px_rgba(255,255,255,1)] md:shadow-[12px_12px_0px_rgba(255,255,255,1)]">
                <div className="p-6 md:p-8 border-b-4 border-white bg-[#A855F7] text-black">
                    <div className="flex items-center gap-3 mb-2">
                        <img src="/images/logo.png" alt="Vault Logo" className="w-10 h-10 object-contain" />
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Vault</h1>
                    </div>
                    <div className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase">Inventory Management System</div>
                </div>

                <div className="p-8 md:p-10 space-y-8 bg-[#0A0A0A]">
                    <div className="technicalLabel">Sign in to continue</div>
                    <button
                        onClick={signInWithGoogle}
                        className="flex w-full items-center justify-center gap-4 border-4 border-white bg-transparent px-6 py-4 text-xs font-black uppercase tracking-widest transition active:translate-y-1 shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-[#00FFC2] hover:text-black"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="h-5 w-5"
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

