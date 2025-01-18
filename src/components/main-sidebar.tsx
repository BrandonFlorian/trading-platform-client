import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/types/utils";
import {
    LayoutDashboard,
    Wallet,
    Search,
    Coins,
    Settings,
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarProvider,
} from "@/components/ui/sidebar";

const MainSidebar = () => {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    const menuItems = [
        {
            title: "Dashboard",
            href: "/",
            icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
            title: "Tracked Wallet",
            href: "/trackedwallet",
            icon: <Wallet className="h-4 w-4" />,
        },
        {
            title: "Wallet Lookup",
            href: "/walletlookup",
            icon: <Search className="h-4 w-4" />,
        },
        {
            title: "Approved Tokens",
            href: "/approved-tokens",
            icon: <Coins className="h-4 w-4" />,
            disabled: true, // Disabled until backend implementation
        },
        {
            title: "Settings",
            href: "/settings",
            icon: <Settings className="h-4 w-4" />,
            disabled: true, // Disabled until backend implementation
        },
    ];

    return (
        <SidebarProvider defaultOpen>
            <Sidebar>
                <SidebarHeader className="border-b border-border p-4">
                    <h2 className="text-lg font-semibold">Trading Platform</h2>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href}
                                    disabled={item.disabled}
                                    className={cn(
                                        "flex items-center gap-2",
                                        item.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <Link href={item.disabled ? "#" : item.href}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>

                    {/* Future feature placeholders */}
                    {/* 
          <div className="mt-4 px-4">
            <div className="rounded-lg bg-secondary p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">User Profile</span>
                  <span className="text-xs text-muted-foreground">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
          */}
                </SidebarContent>

                <SidebarFooter className="border-t border-border p-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 hover:bg-accent"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                        <span>Toggle Theme</span>
                    </button>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
};

export default MainSidebar;