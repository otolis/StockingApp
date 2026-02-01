"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InventoryItem } from "@/types";
import { animate, stagger } from "animejs";
import {
    LayoutDashboard, Package, AlertTriangle, Search, Plus, Edit2, Trash2, Shield, Settings, Menu,
    ChevronDown, ChevronRight
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import ItemModal from "@/components/ItemModal";
import Sidebar from "@/components/Sidebar";
import { normalizeInventoryItem } from "@/lib/dataUtils";

export default function AdminPage() {
    const { user, loading, logout, isAdmin } = useAuth();
    const router = useRouter();
    const { addItem, updateItem, deleteItem } = useInventory();

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [isAlertsExpanded, setIsAlertsExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const itemsPerPage = 10;

    const dynamicCategories = ["All", ...Array.from(new Set(items.map(item => item.category || "Other"))).filter(Boolean)];

    const lowStockItems = items.filter(item => Number(item.quantity) < Number(item.minThreshold));

    const filteredItems = items
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let aValue: any = a[sortConfig.key as keyof InventoryItem] ?? "";
            let bValue: any = b[sortConfig.key as keyof InventoryItem] ?? "";

            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page on search or filter
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

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
            const itemsList: InventoryItem[] = snapshot.docs.map(doc =>
                normalizeInventoryItem(doc.id, doc.data())
            );
            setItems(itemsList);
        });
    }, [user]);

    // Animate alerts when expanded
    useEffect(() => {
        if (isAlertsExpanded && lowStockItems.length > 0) {
            // Precise delay to ensure React has flushed the DOM for newly mounted cards
            const timer = setTimeout(() => {
                animate('.alert-card', {
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    translateY: [20, 0],
                    rotateX: [15, 0],
                    duration: 600,
                    delay: stagger(100),
                    easing: 'easeOutExpo'
                });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isAlertsExpanded, lowStockItems.length]);

    if (loading || !user || !isAdmin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white animate-pulse">Loading...</div>
            </div>
        );
    }

    const handleCreateOrUpdate = async (formData: any) => {
        if (editingItem) await updateItem(editingItem.id, formData);
        else await addItem({ ...formData, organizationId: user.organizationId });
        setEditingItem(null);
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden">
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
                    <Package className="text-[#FFB800]" size={20} />
                    <div className="font-extrabold text-lg tracking-tighter text-white">Nexus Stock</div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 border-2 border-white hover:bg-[#FFB800] hover:text-black transition"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Main Content */}
            <main className="lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8">
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
                            <div className="hidden md:flex items-center gap-2">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-black border-2 border-white px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-[#FFB800] transition cursor-pointer"
                                >
                                    {dynamicCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <select
                                    value={`${sortConfig.key}-${sortConfig.direction}`}
                                    onChange={(e) => {
                                        const [key, direction] = e.target.value.split('-');
                                        setSortConfig({ key, direction: direction as 'asc' | 'desc' });
                                    }}
                                    className="bg-black border-2 border-white px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-[#FFB800] transition cursor-pointer"
                                >
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                    <option value="quantity-asc">Qty (Low-High)</option>
                                    <option value="quantity-desc">Qty (High-Low)</option>
                                    <option value="category-asc">Category</option>
                                </select>
                            </div>
                            <button
                                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-white bg-[#FFB800] text-black font-black uppercase text-xs active:translate-y-1 transition shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                            >
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <div className="md:hidden mt-4 flex flex-col gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-black border-2 border-white px-3 py-2 text-[10px] font-black uppercase outline-none"
                        >
                            {dynamicCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={`${sortConfig.key}-${sortConfig.direction}`}
                            onChange={(e) => {
                                const [key, direction] = e.target.value.split('-');
                                setSortConfig({ key, direction: direction as 'asc' | 'desc' });
                            }}
                            className="w-full bg-black border-2 border-white px-3 py-2 text-[10px] font-black uppercase outline-none"
                        >
                            <option value="name-asc">Sort: Name (A-Z)</option>
                            <option value="name-desc">Sort: Name (Z-A)</option>
                            <option value="quantity-asc">Sort: Qty (Low-High)</option>
                            <option value="quantity-desc">Sort: Qty (High-Low)</option>
                        </select>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                {lowStockItems.length > 0 && (
                    <div className="mb-8">
                        <div className="border-2 border-amber-500">
                            <button
                                onClick={() => {
                                    setIsAlertsExpanded(!isAlertsExpanded);
                                    animate('.alert-toggle', {
                                        scale: [1, 0.95, 1],
                                        duration: 200,
                                        easing: 'easeInOutQuad'
                                    });
                                }}
                                className="alert-toggle w-full flex justify-between items-center px-6 py-3 bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                            >
                                <span className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
                                    <AlertTriangle size={18} strokeWidth={3} /> Critical Attention
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black text-amber-500 px-2 py-0.5">
                                        {lowStockItems.length} alerts
                                    </span>
                                    {isAlertsExpanded ? <ChevronDown size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
                                </div>
                            </button>

                            {isAlertsExpanded && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6 bg-amber-500/5">
                                    {lowStockItems.map(item => (
                                        <div key={item.id} className="alert-card p-4 border-2 border-amber-500/30 bg-black hover:border-amber-500 transition-colors cursor-pointer shadow-[4px_4px_0px_rgba(245,158,11,0.2)]"
                                            onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                                            <div className="flex gap-4 mb-3">
                                                <div className="w-12 h-12 border border-amber-500/30 flex-shrink-0 bg-amber-500/5 overflow-hidden">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package size={20} className="text-amber-500/40" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-black text-sm uppercase text-amber-500 leading-tight">{item.name}</div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="text-[10px] opacity-40 uppercase">Stock Level</div>
                                                <div className="text-red-500 font-black text-2xl leading-none">
                                                    {Number(item.quantity)}
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                                                <span className="text-[10px] opacity-40 font-mono italic">{item.sku}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">Configure</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Inventory Table (Desktop) / Cards (Mobile) */}
                <div className="border-2 border-white">
                    <div className="flex justify-between items-center px-4 md:px-6 py-3 border-b-2 border-white bg-white/5">
                        <span className="font-bold text-sm uppercase tracking-wide">Manage Items</span>
                        <span className="text-xs border border-white px-2 py-1">{filteredItems.length} records</span>
                    </div>

                    {/* Mobile Card Layout (Hidden on LG+) */}
                    <div className="lg:hidden p-4 space-y-4">
                        {paginatedItems.length === 0 ? (
                            <div className="text-center py-10 opacity-40 text-xs text-white uppercase tracking-widest">No matching assets</div>
                        ) : (
                            paginatedItems.map(item => {
                                const qty = Number(item.quantity) || 0;
                                const threshold = Number(item.minThreshold) || 0;
                                const isLowStock = qty < threshold;
                                const statusText = qty === 0 ? 'No Stock' : isLowStock ? 'Low Stock' : 'In Stock';
                                const statusColor = qty === 0 ? 'bg-red-600 text-white border-red-600' : isLowStock ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-green-500/20 text-green-400 border-green-500';

                                return (
                                    <div key={item.id} className="border-2 border-white/20 p-5 bg-white/5 hover:border-white transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.05)] overflow-hidden">
                                        <div className="flex flex-col min-[400px]:flex-row gap-4 mb-4">
                                            <div className="w-16 h-16 border-2 border-white/10 flex-shrink-0 overflow-hidden bg-white/5">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={24} className="opacity-20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col min-[450px]:flex-row justify-between items-start gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-black uppercase text-base leading-tight truncate">{item.name}</div>
                                                        <div className="text-[10px] font-mono opacity-40 italic mt-1">{item.sku}</div>
                                                    </div>
                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase border flex-shrink-0 whitespace-nowrap ${statusColor}`}>
                                                        {statusText}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <div className="text-[10px] uppercase text-white/30 mb-1 tracking-widest">Quantity</div>
                                                <div className={`text-2xl font-black ${isLowStock ? 'text-red-500' : 'text-[#00FFC2]'}`}>
                                                    {qty}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-white/30 mb-1 tracking-widest">Category</div>
                                                <div className="text-xs uppercase font-black">{item.category || "Unassigned"}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-white bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#FFB800] hover:border-[#FFB800] transition-colors"
                                            >
                                                <Edit2 size={12} /> Edit
                                            </button>
                                            <button
                                                onClick={async () => { if (confirm('Delete this asset?')) await deleteItem(item.id); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-red-500 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Desktop Table Layout (Visible on LG+) */}
                    <div className="hidden lg:block overflow-x-auto">
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
                                {paginatedItems.map(item => {
                                    const qty = Number(item.quantity) || 0;
                                    const threshold = Number(item.minThreshold) || 0;
                                    const isLowStock = qty < threshold;
                                    return (
                                        <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 border border-white/10 flex-shrink-0 overflow-hidden bg-white/5">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                                <Package size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-bold uppercase">{item.name}</span>
                                                </div>
                                            </td>
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
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${qty === 0 ? 'bg-red-600 text-white border border-red-600' :
                                                    isLowStock ? 'bg-amber-500/20 text-amber-500 border border-amber-500' :
                                                        'bg-green-500/20 text-green-400 border border-green-500'}`}>
                                                    {qty === 0 ? 'No Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t-2 border-white flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
                            <div className="text-[10px] uppercase font-black tracking-widest opacity-40">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white"
                                >
                                    Prev
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                                        .map((page, index, array) => (
                                            <div key={page} className="flex items-center">
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="px-1 opacity-40">...</span>
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 flex items-center justify-center text-[10px] font-black border ${currentPage === page ? 'bg-[#FFB800] text-black border-[#FFB800]' : 'border-white/20 hover:border-white'}`}
                                                >
                                                    {page}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ItemModal
                isOpen={isModalOpen}
                categories={CATEGORIES_FOR_MODAL}
                initialData={editingItem}
                onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
                onSubmit={handleCreateOrUpdate}
            />
        </div>
    );
}

const CATEGORIES_FOR_MODAL = ["Electronics", "Furniture", "Office Supplies", "Perishables", "Other"];
