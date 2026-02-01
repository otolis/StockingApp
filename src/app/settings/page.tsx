"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, ArrowLeft, User, Camera, Save } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setPhotoURL(user.photoURL || "");
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setMessage("");

        try {
            await updateDoc(doc(db, "users", user.id), {
                displayName: displayName.trim(),
                photoURL: photoURL.trim(),
            });
            setMessage("Profile updated successfully!");
            // Reload page after a short delay to show success message
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white animate-pulse">Loading...</div>
            </div>
        );
    }

    const backPath = user.role === "admin" || user.role === "manager" ? "/admin" : "/dashboard";

    return (
        <div className="min-h-screen bg-black text-white font-mono">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r-2 border-white bg-[#0A0A0A] z-40 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-12">
                    <Package className="text-[#FFB800]" size={24} />
                    <div className="font-extrabold text-xl tracking-tighter">Nexus Stock</div>
                </div>

                <nav className="flex-1 space-y-4">
                    <div className="text-xs uppercase text-white/60 mb-2">Settings</div>
                    <Link
                        href={backPath}
                        className="flex items-center gap-3 w-full p-2 border-2 border-white/30 text-white/60 font-bold text-xs uppercase transition hover:border-white hover:text-white"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <button className="flex items-center gap-3 w-full p-2 border-2 border-white bg-white text-black font-bold text-xs uppercase transition">
                        <User size={14} /> Account
                    </button>
                </nav>

                <div className="pt-6 border-t-2 border-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 border-2 border-white flex items-center justify-center font-black overflow-hidden">
                            {photoURL ? (
                                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user.displayName?.[0] || "U"
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-sm truncate uppercase">{user.displayName}</div>
                            <div className="text-xs text-white/60 uppercase">{user.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full p-2 border-2 border-red-500 text-red-500 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                <div className="max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Account Settings</h1>
                        <p className="text-sm text-white/60 mt-2">Update your profile information</p>
                    </div>

                    {/* Profile Form */}
                    <div className="border-2 border-white p-8 space-y-8">
                        {/* Profile Picture */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white/60 mb-4">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 border-2 border-white flex items-center justify-center font-black text-3xl overflow-hidden">
                                    {photoURL ? (
                                        <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="opacity-40" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Paste image URL..."
                                        value={photoURL}
                                        onChange={(e) => setPhotoURL(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-white bg-transparent outline-none focus:bg-white/5 transition font-mono text-sm"
                                    />
                                    <p className="text-xs text-white/40 mt-2">Enter a URL to an image (e.g., from Google Photos or Imgur)</p>
                                </div>
                            </div>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white/60 mb-4">
                                Display Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name..."
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-white bg-transparent outline-none focus:bg-white/5 transition font-mono text-lg font-bold"
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white/60 mb-4">
                                Email Address
                            </label>
                            <div className="w-full px-4 py-3 border-2 border-white/30 bg-white/5 text-white/60 font-mono text-sm">
                                {user.email}
                            </div>
                            <p className="text-xs text-white/40 mt-2">Email is managed through Google and cannot be changed here</p>
                        </div>

                        {/* Role (Read-only) */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-white/60 mb-4">
                                Role
                            </label>
                            <div className="inline-block px-4 py-2 border-2 border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] font-bold text-sm uppercase">
                                {user.role}
                            </div>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`p-4 border-2 text-sm font-bold ${message.includes('success') ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                {message}
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 px-8 py-4 border-2 border-white bg-[#FFB800] text-black font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={16} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
