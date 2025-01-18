// components/footer/Footer.tsx
"use client";

import { useState, useEffect } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function Footer() {
    // Track when we're near the bottom of the page
    const [isNearBottom, setIsNearBottom] = useState(false);

    useEffect(() => {
        // This function calculates our position relative to the bottom of the page
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY;

            // We consider "near bottom" to be within 100px of the page end
            const threshold = 100;
            const bottomDistance = documentHeight - (scrollPosition + windowHeight);

            setIsNearBottom(bottomDistance < threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className={cn(
            // Base positioning and layout
            "fixed left-0 right-0 w-full bg-gradient-to-r from-purple-50/50 via-white/50 to-blue-50/50",
            "dark:from-purple-950/50 dark:via-gray-950/50 dark:to-blue-950/50",
            "backdrop-blur-sm shadow-lg z-10 transition-all duration-300",
            "bottom-4", // Slight offset from bottom
            // Animation control
            isNearBottom ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        )}>
            <div className="container mx-auto px-4 h-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 py-2">
                    {/* Company Information Section */}
                    <div className="text-center md:text-left transition-all duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Trading Platform
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your trusted crypto trading companion
                        </p>
                    </div>

                    {/* Resources Navigation Section */}
                    <div className="flex items-center">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger
                                        className="bg-transparent hover:bg-white/10 dark:hover:bg-black/10"
                                    >
                                        Resources
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="z-20">
                                        <div className="grid gap-3 p-4 w-[400px] md:w-[500px] bg-popover rounded-lg border shadow-lg">
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Documentation Link */}
                                                <a
                                                    href="https://docs.solana.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block space-y-1 rounded-lg p-3 hover:bg-accent"
                                                >
                                                    <div className="font-medium">Documentation</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Official Solana documentation
                                                    </div>
                                                </a>
                                                {/* Explorer Link */}
                                                <a
                                                    href="https://solscan.io"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block space-y-1 rounded-lg p-3 hover:bg-accent"
                                                >
                                                    <div className="font-medium">Explorer</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        View transactions on Solscan
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Logo and Social Links Section */}
                    <TooltipProvider>
                        <div className="flex items-center gap-4">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href="https://solana.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                                    >
                                        <img
                                            src="/solana-logo.svg"
                                            alt="Solana"
                                            className="w-6 h-6"
                                            onError={(e) => {
                                                // Fallback for missing logo
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Built on Solana</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>

                {/* Copyright Section */}
                <div className="text-center pt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} Trading Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}