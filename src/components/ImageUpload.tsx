"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImageUrl?: string;
    folder?: string; // Kept for compatibility, though ImgBB doesn't use folders
}

export default function ImageUpload({ onUploadComplete, currentImageUrl, folder }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync preview when currentImageUrl changes
    useEffect(() => {
        setPreview(currentImageUrl || null);
    }, [currentImageUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!apiKey) {
            alert("ImgBB API Key is missing. Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env.local file.");
            return;
        }

        console.log("DEBUG: Starting ImgBB upload for:", file.name);

        // Show local preview
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);
        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("image", file);

        const xhr = new XMLHttpRequest();

        // Progress tracking
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const pct = (event.loaded / event.total) * 100;
                console.log(`DEBUG: Upload progress: ${Math.round(pct)}%`);
                setProgress(Math.round(pct));
            }
        };

        xhr.onload = () => {
            setUploading(false);
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url;
                    console.log("DEBUG: ImgBB upload successful:", url);
                    onUploadComplete(url);
                    setPreview(url);
                } catch (error) {
                    console.error("DEBUG: Failed to parse ImgBB response:", error);
                    alert("Failed to process upload response.");
                }
            } else {
                console.error("DEBUG: ImgBB Upload Error:", xhr.status, xhr.responseText);
                alert(`Upload failed with status ${xhr.status}. Check console for details.`);
                setPreview(currentImageUrl || null);
            }
        };

        xhr.onerror = () => {
            setUploading(false);
            console.error("DEBUG: XHR Error during upload");
            alert("Network error occurred during upload.");
            setPreview(currentImageUrl || null);
        };

        xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);
        xhr.send(formData);
    };

    const handleRemove = () => {
        setPreview(null);
        onUploadComplete("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-6">
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`
                        w-24 h-24 border-2 border-white flex items-center justify-center font-black overflow-hidden cursor-pointer relative group transition-all
                        ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}
                    `}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <Camera size={32} className="opacity-40 group-hover:opacity-100 transition" />
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 text-center">
                            <Loader2 size={24} className="animate-spin text-[#A855F7] mb-2" />
                            <div className="text-[10px] font-black text-[#A855F7] tracking-tighter">{progress}%</div>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-white bg-transparent text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
                        >
                            <Upload size={14} /> {preview ? "Change Photo" : "Upload Photo"}
                        </button>

                        {preview && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 font-bold uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            >
                                <X size={14} /> Remove
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-white/40 mt-3 uppercase tracking-widest">Free Image Hosting via ImgBB. Max 32MB.</p>
                </div>
            </div>
        </div>
    );
}
