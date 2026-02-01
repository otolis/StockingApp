"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InventoryItem } from "@/types";
import {
    LayoutDashboard, Package, AlertTriangle, Search, Plus, Edit2, Trash2, Shield, Settings
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import ItemModal from "@/components/ItemModal";

export default function AdminPage() {
    const { user, loading, logout, isAdmin } = useAuth();
    const router = useRouter();
    const { addItem, updateItem, deleteItem } = useInventory();

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const categories = ["Electronics", "Furniture", "Office Supplies", "Perishables", "Other"];

    // Redirect non-admins to dashboard, unauthenticated to login
    useEffect(() => {
        if (!loading) {
            if (!user) router.push("/login");
            else if (!isAdmin) router.push("/dashboard");
        }
    }, [user, loading, router, isAdmin]);

    // Fetch inventory items
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "inventoryItems"), where("organizationId", "==", user.organizationId));
        return onSnapshot(q, (snapshot) => {
            const itemsList: InventoryItem[] = [];
            snapshot.forEach((doc) => {
                const rawData = doc.data();
                // Normalize field names - Firestore has trailing spaces in field names
                const data: InventoryItem = {
                    id: doc.id,
                    name: rawData.name || rawData["name "] || "",
                    sku: rawData.sku || rawData["sku "] || "",
                    category: rawData.category || rawData["category "] || "",
                    quantity: rawData.quantity ?? rawData["quantity "] ?? 0,
                    minThreshold: rawData.minThreshold ?? rawData["minThreshold "] ?? 0,
                    organizationId: rawData.organizationId || rawData["organizationId "] || "",
                    createdAt: rawData.createdAt || rawData["createdAt "],
                    updatedAt: rawData.updatedAt || rawData["updatedAt "],
                };
                itemsList.push(data);
            });
            setItems(itemsList);
        });
    }, [user]);

    if (loading || !user || !isAdmin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white animate-pulse">Loading...</div>
            </div>
        );
    }

    const lowStockItems = items.filter(item => Number(item.quantity) < Number(item.minThreshold));
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOrUpdate = async (formData: any) => {
        if (editingItem) await updateItem(editingItem.id, formData);
        else await addItem({ ...formData, organizationId: user.organizationId });
        setEditingItem(null);
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r-2 border-white bg-[#0A0A0A] z-40 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-12">
                    <Package className="text-[#FFB800]" size={24} />
                    <div className="font-extrabold text-xl tracking-tighter">Nexus Stock</div>
                </div>

                <nav className="flex-1 space-y-4">
                    <div className="text-xs uppercase text-white/60 mb-2">Admin Panel</div>
                    <button className="flex items-center gap-3 w-full p-2 border-2 border-white bg-white text-black font-bold text-xs uppercase transition">
                        <Shield size={14} /> Dashboard
                    </button>
                    <a href="/settings" className="flex items-center gap-3 w-full p-2 border-2 border-white/30 text-white/60 font-bold text-xs uppercase transition hover:border-white hover:text-white">
                        <Settings size={14} /> Settings
                    </a>
                </nav>

                <div className="pt-6 border-t-2 border-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 border-2 border-[#FFB800] bg-[#FFB800]/10 flex items-center justify-center font-black text-[#FFB800] overflow-hidden">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user.displayName?.[0] || "A"
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-sm truncate uppercase">{user.displayName}</div>
                            <div className="text-xs text-[#FFB800] uppercase font-bold">{user.role}</div>
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
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
                            <div className="text-xs text-white/60 uppercase mt-1">Manage inventory and alerts</div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-2.5 opacity-40" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-white bg-transparent outline-none focus:bg-black transition font-bold text-xs"
                                />
                            </div>
                            <button
                                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-white bg-[#FFB800] text-black font-black uppercase text-xs active:translate-y-1 transition shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                            >
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                {lowStockItems.length > 0 && (
                    <div className="mb-8">
                        <div className="border-2 border-amber-500">
                            <div className="flex justify-between items-center px-6 py-3 bg-amber-500 text-black">
                                <span className="flex items-center gap-2 font-bold">
                                    <AlertTriangle size={14} /> Low Stock Alerts
                                </span>
                                <span className="text-sm font-bold">{lowStockItems.length} items need attention</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                                {lowStockItems.map(item => (
                                    <div key={item.id} className="p-4 border border-dashed border-red-500 bg-red-500/10 hover:bg-red-500/20 transition cursor-pointer"
                                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                                        <div className="font-bold text-sm uppercase mb-2">{item.name}</div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs opacity-60">{item.sku}</span>
                                            <span className="text-red-500 font-bold text-lg">
                                                {Number(item.quantity)} / {Number(item.minThreshold)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-red-400 mt-2">Click to edit</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Table */}
                <div className="border-2 border-white">
                    <div className="flex justify-between items-center px-6 py-3 border-b-2 border-white bg-white/5">
                        <span className="font-bold text-sm uppercase tracking-wide">All Items</span>
                        <span className="text-xs border border-white px-2 py-1">{filteredItems.length} records</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/20 text-[10px] font-bold uppercase text-white/60">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4 text-center">Qty</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredItems.map(item => {
                                    const qty = Number(item.quantity) || 0;
                                    const threshold = Number(item.minThreshold) || 0;
                                    const isLowStock = qty < threshold;
                                    return (
                                        <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold uppercase">{item.name}</td>
                                            <td className="px-6 py-4 opacity-60 font-mono">{item.sku}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-lg font-black ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>
                                                    {qty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="border border-white/40 px-2 py-1 text-xs uppercase">
                                                    {item.category || "General"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${isLowStock ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-green-500/20 text-green-400 border border-green-500'}`}>
                                                    {isLowStock ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                                        className="p-2 border border-white hover:bg-white hover:text-black transition"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={async () => { if (confirm('Delete this item?')) await deleteItem(item.id); }}
                                                        className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <ItemModal
                isOpen={isModalOpen}
                categories={categories}
                initialData={editingItem}
                onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
                onSubmit={handleCreateOrUpdate}
            />
        </div>
    );
}
