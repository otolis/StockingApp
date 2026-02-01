"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, ArrowLeft, User, Camera, Save, Settings as GearIcon, Menu } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ImageUpload from "@/components/ImageUpload";

export default function SettingsPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            <Sidebar
                user={user}
                logout={logout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0A0A0A] border-b-2 border-white z-30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="Vault Logo" className="w-8 h-8 object-contain filter invert" />
                    <div className="font-extrabold text-lg tracking-tighter text-white">Vault</div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 border-2 border-white hover:bg-[#A855F7] hover:text-black transition"
                >
                    <GearIcon size={20} />
                </button>
            </div>

            {/* Main Content */}
            <main className="lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8">
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
                            <ImageUpload
                                currentImageUrl={photoURL}
                                onUploadComplete={(url) => setPhotoURL(url)}
                                folder="profiles"
                            />
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
                            <div className="inline-block px-4 py-2 border-2 border-[#A855F7] bg-[#A855F7]/10 text-[#A855F7] font-bold text-sm uppercase">
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
                            className="flex items-center gap-3 px-8 py-4 border-2 border-white bg-[#A855F7] text-black font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
