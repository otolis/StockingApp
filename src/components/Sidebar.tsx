"use client";

import { LayoutDashboard, Package, Settings, Shield, X, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    user: any;
    logout: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ user, logout, isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const isAdmin = user?.role === "admin" || user?.role === "manager";

    const navItems = [
        {
            name: isAdmin ? "Admin Dashboard" : "Inventory",
            href: isAdmin ? "/admin" : "/dashboard",
            icon: isAdmin ? Shield : LayoutDashboard,
        },
        {
            name: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-full w-64 border-r-2 border-white bg-[#0A0A0A] z-50 p-6 flex flex-col transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2">
                        <Package className="text-[#FFB800]" size={24} />
                        <div className="font-extrabold text-xl tracking-tighter text-white">Nexus Stock</div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-1 border-2 border-white hover:bg-white hover:text-black transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-4">
                    <div className="text-xs uppercase text-white/60 mb-2">{isAdmin ? "Admin Panel" : "Navigation"}</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center gap-3 w-full p-2 border-2 transition font-bold text-xs uppercase
                                    ${isActive
                                        ? 'border-white bg-white text-black'
                                        : 'border-white/30 text-white/60 hover:border-white hover:text-white'}
                                `}
                            >
                                <Icon size={14} /> {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t-2 border-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`h-10 w-10 border-2 flex items-center justify-center font-black overflow-hidden ${isAdmin ? 'border-[#FFB800]' : 'border-white'}`}>
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.displayName?.[0] || "U"
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-sm truncate uppercase text-white">{user?.displayName}</div>
                            <div className={`text-xs uppercase font-bold ${isAdmin ? 'text-[#FFB800]' : 'text-white/60'}`}>
                                {user?.role || "User"}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full p-2 border-2 border-red-500 text-red-500 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
