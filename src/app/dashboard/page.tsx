"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InventoryItem } from "@/types";
import {
    LayoutDashboard, LogOut, Package, AlertTriangle, Search, Plus, Edit2, Trash2
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import ItemModal from "@/components/ItemModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const { addItem, updateItem, deleteItem } = useInventory();

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const categories = ["Electronics", "Furniture", "Office Supplies", "Perishables", "Other"];

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "inventoryItems"), where("organizationId", "==", user.organizationId));
        return onSnapshot(q, (snapshot) => {
            const itemsList: InventoryItem[] = [];
            snapshot.forEach((doc) => itemsList.push({ id: doc.id, ...doc.data() } as InventoryItem));
            setItems(itemsList);
        });
    }, [user]);

    if (loading || !user) {
        return (
            <div className="mainGridCanvas flex items-center justify-center">
                <div className="tactileNode animate-pulse">
                    LOADING_SYSTEM_RESOURCES...
                </div>
            </div>
        );
    }

    const isAdmin = user.role === "admin" || user.role === "manager";
    const lowStockItems = items.filter(item => (item.quantity ?? 0) < (item.minThreshold ?? 0));
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOrUpdate = async (formData: any) => {
        if (editingItem) await updateItem(editingItem.id, formData);
        else await addItem({ ...formData, organizationId: user.organizationId });
        setEditingItem(null);
    };

    return (
        <div className="mainGridCanvas dark:bg-black font-mono">
            {/* Intent Orchestrator Sidebar (Technical Minimalist) */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r-2 border-black dark:border-white bg-[#F7F5F0] dark:bg-[#0A0A0A] z-40 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-12">
                    <Package className="text-[#FFB800]" size={24} />
                    <div className="font-extrabold text-xl tracking-tighter">NXS_STOCK</div>
                </div>

                <nav className="flex-1 space-y-4">
                    <div className="technicalLabel">NAVIGATION_SYSTEM</div>
                    <button className="flex items-center gap-3 w-full p-2 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase transition">
                        <LayoutDashboard size={14} /> ACTIVE_DASHBOARD
                    </button>

                    <div className="pt-8 technicalLabel">ORCHESTRATION_CONTROL</div>
                    <ThemeToggle />
                </nav>

                <div className="pt-6 border-t-2 border-black dark:border-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 border-2 border-black dark:border-white flex items-center justify-center font-black">
                            {user.displayName?.[0] || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-sm truncate uppercase">{user.displayName}</div>
                            <div className="technicalLabel">ROLE: {user.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full p-2 border-2 border-red-500 text-red-500 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition"
                    >
                        TERMINATE_SESSION
                    </button>
                </div>
            </aside>

            {/* Infinite Canvas */}
            <main className="ml-64 canvasContent">
                {/* Header Node */}
                <div className="col-span-full mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">ACTIVE_INVENTORY</h2>
                            <div className="technicalLabel">COORD_SYSTEM: GRID_B8 / ORG_ID: {user.organizationId}</div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-2.5 opacity-40" size={16} />
                                <input
                                    type="text" placeholder="QUERY_NAME_OR_SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-black dark:border-white bg-transparent outline-none focus:bg-white dark:focus:bg-black transition font-bold text-xs uppercase"
                                />
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                                    className="p-2.5 border-2 border-black dark:border-white bg-[#FFB800] text-black font-black uppercase text-xs active:translate-y-1 transition shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                                >
                                    SPAWN_ITEM_NODE
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Operational Warnings Node */}
                {lowStockItems.length > 0 && (
                    <div className="col-span-full">
                        <div className="tactileNode border-[#FFB800]">
                            <div className="nodeHeader bg-[#FFB800] text-black border-[#FFB800]">
                                <span className="flex items-center gap-2 font-black"><AlertTriangle size={14} /> OPERATIONAL_WARNINGS</span>
                                <span>COUNT: {lowStockItems.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {lowStockItems.map(item => (
                                    <div key={item.id} className="p-3 border-[1.5px] border-dashed border-red-500 bg-red-50 dark:bg-red-900/10">
                                        <div className="font-black text-xs uppercase mb-1">{item.name}</div>
                                        <div className="flex justify-between items-end">
                                            <span className="technicalLabel">{item.sku}</span>
                                            <span className="text-red-500 font-bold">{item.quantity} / {item.minThreshold}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Table Node */}
                <div className="col-span-full overflow-hidden">
                    <div className="tactileNode !p-0">
                        <div className="nodeHeader">
                            <span>INVENTORY_DATAFRAME_V2</span>
                            <span className="badgeMono bg-white dark:bg-black">{filteredItems.length}_RECORDS</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-[1.5px] border-black dark:border-white text-[10px] font-black uppercase">
                                        <th className="px-6 py-4">PRODUCT_ENTITY</th>
                                        <th className="px-6 py-4">SKU_ID</th>
                                        <th className="px-6 py-4 text-center">QUANTITY</th>
                                        <th className="px-6 py-4">CLASS</th>
                                        {isAdmin && <th className="px-6 py-4 text-right">OPERATIONS</th>}
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {filteredItems.map(item => (
                                        <tr key={item.id} className="border-b-[1px] border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-5 font-black uppercase tracking-tight">{item.name}</td>
                                            <td className="px-6 py-5 opacity-60 font-mono tracking-widest">{item.sku}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`text-lg font-black ${(item.quantity ?? 0) < (item.minThreshold ?? 0) ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                                    {item.quantity ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="badgeMono">
                                                    {item.category || "GENERAL"}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"><Edit2 size={14} /></button>
                                                        <button onClick={async () => { if (confirm('TERMINATE_RECORD?')) await deleteItem(item.id); }} className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <ItemModal
                isOpen={isModalOpen} categories={categories} initialData={editingItem}
                onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
                onSubmit={handleCreateOrUpdate}
            />
        </div>
    );
}
