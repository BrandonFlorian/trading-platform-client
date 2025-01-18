// src/components/layout/page-layout.tsx
"use client";

import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import NavBar from "../navbar/Navbar";
import Footer from "../footer/Footer";

interface PageLayoutProps {
    children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
    const { scrolled, scrollDirection, atTop, atBottom } = useScroll();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
                    !atTop && scrollDirection === "down" && "-translate-y-full"
                )}
            >
                <NavBar />
            </div>

            {/* Main content */}
            <main className="flex-grow mt-16 mb-16 transition-all duration-300">
                {children}
            </main>

            {/* Footer */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300",
                    !atBottom && scrollDirection === "up" && "translate-y-full"
                )}
            >
                <Footer />
            </div>
        </div>
    );
}