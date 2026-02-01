"use client";

import { useState, useEffect } from "react";
import { InventoryItem } from "@/types";
import { X, Camera } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: any) => Promise<void>;
    initialData?: InventoryItem | null;
    categories: string[];
}

export default function ItemModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    categories
}: ItemModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        minThreshold: 5,
        imageUrl: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                sku: initialData.sku,
                category: initialData.category,
                quantity: initialData.quantity,
                minThreshold: initialData.minThreshold,
                imageUrl: initialData.imageUrl || "",
            });
        } else {
            setFormData({
                name: "",
                sku: "",
                category: categories[0] || "",
                quantity: 0,
                minThreshold: 5,
                imageUrl: "",
            });
        }
    }, [initialData, categories, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            alert("Error saving item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-mono">
            <div className="bg-[#F7F5F0] dark:bg-[#0A0A0A] w-full max-w-md border-4 border-black dark:border-white shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,1)] animate-in fade-in zoom-in duration-150">
                <div className="flex items-center justify-between p-6 border-b-4 border-black dark:border-white bg-[#FFB800]">
                    <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                        {initialData ? "Edit Item" : "New Item"}
                    </h2>
                    <button onClick={onClose} className="p-2 border-2 border-black hover:bg-black hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <div className="technicalLabel">Name</div>
                        <input
                            required
                            type="text"
                            placeholder="Enter name..."
                            className="w-full px-4 py-3 border-2 border-black dark:border-white bg-transparent outline-none focus:bg-white dark:focus:bg-black font-bold text-xs transition"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="technicalLabel">SKU</div>
                        <input
                            required
                            type="text"
                            placeholder="Enter SKU..."
                            className="w-full px-4 py-3 border-2 border-black dark:border-white bg-transparent outline-none focus:bg-white dark:focus:bg-black font-bold text-xs transition"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="technicalLabel">Category</div>
                        <select
                            className="w-full px-4 py-3 border-2 border-black dark:border-white bg-transparent outline-none focus:bg-white dark:focus:bg-black font-bold uppercase text-xs transition appearance-none"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="bg-white dark:bg-black">{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="technicalLabel">Quantity</div>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full px-4 py-3 border-2 border-black dark:border-white bg-transparent outline-none focus:bg-white dark:focus:bg-black font-bold uppercase text-lg transition"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <div className="technicalLabel">Min Threshold</div>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full px-4 py-3 border-2 border-black dark:border-white bg-transparent outline-none focus:bg-white dark:focus:bg-black font-bold uppercase text-lg transition"
                                value={formData.minThreshold}
                                onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="technicalLabel">Item Image</div>
                        <ImageUpload
                            currentImageUrl={formData.imageUrl}
                            onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                            folder="items"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border-2 border-black dark:border-white font-black uppercase text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 py-3 border-2 border-black dark:border-white bg-[#00FFC2] text-black font-black uppercase text-xs active:translate-y-1 transition shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
