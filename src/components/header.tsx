"use client";

import { ThemeToggle } from "@/components/theme-toggle";  // Updated import path

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Left side - Logo or brand name */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Your App Name</span>
                </div>

                {/* Right side - Theme toggle */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}