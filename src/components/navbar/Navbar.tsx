// components/navbar/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/types/utils";

export default function NavBar() {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            // Make navbar visible when scrolling up or at the top
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-gray-800 p-4",
            !visible && "-translate-y-full"
        )}>
            <div className="flex gap-16">
                <Link href="/" className="text-white hover:text-gray-300">
                    Trading Dashboard
                </Link>
                <Link href="/trackedwallet" className="text-white hover:text-gray-300">
                    Tracked Wallet
                </Link>
                <Link href="/walletlookup" className="text-white hover:text-gray-300">
                    Wallet Lookup
                </Link>
            </div>
        </nav>
    );
}