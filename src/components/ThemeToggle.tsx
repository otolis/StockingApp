"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-3 w-full h-12" />;

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <>
                    <Sun size={20} />
                    Light Mode
                </>
            ) : (
                <>
                    <Moon size={20} />
                    Dark Mode
                </>
            )}
        </button>
    );
}
