"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InventoryItem } from "@/types";
import { LayoutDashboard, Package, Search, Settings, Menu, AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { normalizeInventoryItem } from "@/lib/dataUtils";

export default function DashboardPage() {
    const { user, loading, logout, isAdmin } = useAuth();
    const router = useRouter();

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const itemsPerPage = 10;

    // Redirect admins to admin page, unauthenticated to login
    useEffect(() => {
        if (!loading) {
            if (!user) router.push("/login");
            else if (isAdmin) router.push("/admin");
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

    // Reset to first page on search or filter
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white animate-pulse">Loading...</div>
            </div>
        );
    }

    const dynamicCategories = ["All", ...Array.from(new Set(items.map(item => item.category || "Other"))).filter(Boolean)];

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
                    <div className="font-extrabold text-lg tracking-tighter">Nexus Stock</div>
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
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Inventory</h1>
                            <div className="text-xs text-white/60 uppercase mt-1">Browse available items</div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
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

                {/* Inventory Table (Desktop) / Cards (Mobile) */}
                <div className="border-2 border-white">
                    <div className="flex justify-between items-center px-4 md:px-6 py-3 border-b-2 border-white bg-white/5">
                        <span className="font-bold text-sm uppercase tracking-wide">All Items</span>
                        <span className="text-xs border border-white px-2 py-1">{filteredItems.length} records</span>
                    </div>

                    {/* Mobile Card Layout (Hidden on LG+) */}
                    <div className="lg:hidden p-4 space-y-4">
                        {paginatedItems.length === 0 ? (
                            <div className="text-center py-10 opacity-40 text-xs">No items found</div>
                        ) : (
                            paginatedItems.map(item => {
                                const qty = Number(item.quantity) || 0;
                                const threshold = Number(item.minThreshold) || 0;
                                const isLowStock = qty < threshold;
                                const statusText = qty === 0 ? 'No Stock' : isLowStock ? 'Low Stock' : 'In Stock';
                                const statusColor = qty === 0 ? 'bg-red-600 text-white border-red-600' : isLowStock ? 'bg-amber-500/20 text-amber-500 border-amber-500' : 'bg-green-500/20 text-green-400 border-green-500';

                                return (
                                    <div key={item.id} className="border-2 border-white/20 p-4 bg-white/5 hover:border-white transition-colors overflow-hidden">
                                        <div className="flex flex-col min-[400px]:flex-row gap-4 mb-3">
                                            <div className="w-16 h-16 border-2 border-white/10 flex-shrink-0 overflow-hidden bg-white/5">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col min-[450px]:flex-row justify-between items-start mb-1 gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-black uppercase text-base truncate">{item.name}</div>
                                                        <div className="text-[10px] uppercase text-white/40 mb-1 leading-none">SKU: <span className="text-xs font-mono font-bold text-white/80">{item.sku}</span></div>
                                                    </div>
                                                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase border flex-shrink-0 whitespace-nowrap ${statusColor}`}>
                                                        {statusText}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-[10px] uppercase text-white/40 mb-1">SKU</div>
                                                <div className="text-xs font-mono font-bold">{item.sku}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-white/40 mb-1">Stock Level</div>
                                                <div className={`text-xl font-black ${isLowStock ? 'text-red-500' : 'text-[#00FFC2]'}`}>
                                                    {qty}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-white/40 mb-1">Category</div>
                                                <div className="text-xs uppercase font-bold">{item.category || "General"}</div>
                                            </div>
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
                                                <span className={`text-lg font-black ${qty === 0 ? 'text-red-600' : isLowStock ? 'text-amber-500' : 'text-green-500'}`}>
                                                    {qty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="border border-white/40 px-2 py-1 text-xs uppercase text-white/60">
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
        </div>
    );
}
