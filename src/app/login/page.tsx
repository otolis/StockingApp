"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package } from "lucide-react";

export default function LoginPage() {
    const { user, signInWithGoogle, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="mainGridCanvas flex h-screen items-center justify-center font-mono">
                <div className="tactileNode animate-pulse">CONNECTING_TO_AUTH_GATEWAY...</div>
            </div>
        );
    }

    return (
        <div className="mainGridCanvas flex h-screen items-center justify-center font-mono">
            <div className="tactileNode w-full max-w-sm !p-0 overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_rgba(255,255,255,1)]">
                <div className="p-8 border-b-4 border-black dark:border-white bg-[#FFB800] text-black">
                    <div className="flex items-center gap-3 mb-2">
                        <Package size={32} strokeWidth={3} />
                        <h1 className="text-4xl font-black tracking-tighter uppercase">Nexus_Stock</h1>
                    </div>
                    <div className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase">SMART_INVENTORY_SYSTEM_v2.6</div>
                </div>

                <div className="p-10 space-y-8 bg-[#F7F5F0] dark:bg-[#0A0A0A]">
                    <div className="technicalLabel">AUTHENTICATION_PROTOCOL</div>
                    <button
                        onClick={signInWithGoogle}
                        className="flex w-full items-center justify-center gap-4 border-4 border-black dark:border-white bg-white dark:bg-transparent px-6 py-4 text-xs font-black uppercase tracking-widest transition active:translate-y-1 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-[#00FFC2] hover:text-black dark:hover:bg-[#00FFC2]"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="h-5 w-5"
                        />
                        ESTABLISH_AUTH_LINK
                    </button>

                    <div className="technicalLabel pt-4 border-t-2 border-black/10 dark:border-white/10 text-center">
                        SECURITY_STATUS: [SYSTEM_READY]
                    </div>
                </div>
            </div>
        </div>
    );
}
