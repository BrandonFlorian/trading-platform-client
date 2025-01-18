// src/hooks/use-scroll.ts
"use client";

import { useState, useEffect } from "react";

export function useScroll(threshold = 0) {
    const [scrolled, setScrolled] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
    const [atTop, setAtTop] = useState(true);
    const [atBottom, setAtBottom] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const updateScrollPosition = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Update scroll direction
            if (currentScrollY > lastScrollY) {
                setScrollDirection("down");
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection("up");
            }

            // Update scrolled state
            setScrolled(currentScrollY > threshold);

            // Update top/bottom states
            setAtTop(currentScrollY <= 0);
            setAtBottom(
                Math.ceil(currentScrollY + windowHeight) >= documentHeight - 10
            );

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", updateScrollPosition, { passive: true });

        // Initial check
        updateScrollPosition();

        return () => window.removeEventListener("scroll", updateScrollPosition);
    }, [lastScrollY, threshold]);

    return { scrolled, scrollDirection, atTop, atBottom };
}