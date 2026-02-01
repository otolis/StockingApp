"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Nexus Stock
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Smart Inventory Management
                    </p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={signInWithGoogle}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="h-5 w-5"
                        />
                        Sign in with Google
                    </button>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Secure authentication powered by Firebase
                </div>
            </div>
        </div>
    );
}
