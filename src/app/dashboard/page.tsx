"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InventoryItem } from "@/types";
import { LayoutDashboard, LogOut, Package, AlertTriangle, Search } from "lucide-react";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "inventoryItems"),
            where("organizationId", "==", user.organizationId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsList: InventoryItem[] = [];
            snapshot.forEach((doc) => {
                itemsList.push({ id: doc.id, ...doc.data() } as InventoryItem);
            });
            setItems(itemsList);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600">Loading Dashboard...</div>
            </div>
        );
    }

    const lowStockItems = items.filter(item => item.quantity < item.minThreshold);
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="text-blue-600" />
                        Nexus Stock
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 p-3 truncate">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                            {user.displayName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-2 flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Inventory Overview</h2>
                        <p className="text-gray-500">Real-time status of your items</p>
                    </div>
                    <div className="relative w-72">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Smart Alerts */}
                {lowStockItems.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="text-amber-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Smart Alerts</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockItems.map(item => (
                                <div key={item.id} className="card border-l-4 border-l-amber-500 !p-4 flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                                        <p className="mt-2 text-sm text-red-600 font-medium">
                                            Quantity: {item.quantity} (Min: {item.minThreshold})
                                        </p>
                                    </div>
                                    <span className="badge-warning">Low Stock</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Stock Levels Table */}
                <section className="card !p-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">All Items</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{item.sku}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${item.quantity < item.minThreshold ? 'text-red-600' : 'text-green-600'}`}>
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.quantity < item.minThreshold ? (
                                            <span className="badge-warning">Restock Needed</span>
                                        ) : (
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-semibold border border-green-100">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                                        No items found. Go to Firestore to add some data!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}
