"use client"
import { WatchlistButton } from '@/components/watchlist/watchlist-button'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart2, 
  WalletCards, 
  Search, 
  Settings, 
  ChevronsLeft, 
  ChevronsRight,
  Star 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WatchlistPanel } from './watchlist-panel'

const SIDEBAR_ITEMS = [
  { 
    href: '/trading', 
    icon: BarChart2, 
    label: 'Trading' 
  },
  { 
    href: '/tracked-wallets', 
    icon: WalletCards, 
    label: 'Tracked Wallets' 
  },
  { 
    href: '/wallet-lookup', 
    icon: Search, 
    label: 'Wallet Lookup' 
  },
  { 
    href: '/settings', 
    icon: Settings, 
    label: 'Settings' 
  }
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 z-40 flex flex-col",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div 
            className={cn(
              "flex items-center justify-between p-4 border-b",
              isCollapsed && "flex-col"
            )}
          >
            {!isCollapsed && (
              <span className="text-xl font-bold">Menu</span>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-accent rounded-md p-2"
            >
              {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
            </button>
          </div>
          
          <nav className="flex-1 py-4">
            {SIDEBAR_ITEMS.map((item) => (
              <SidebarItem 
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* Watchlist Button */}
          <div className="p-4 border-t">
            <WatchlistPanel>
            <WatchlistButton />
            </WatchlistPanel>
          </div>
        </div>
      </div>
    </>
  )
}
interface SidebarItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  isCollapsed?: boolean
  isActive?: boolean
}

function SidebarItem({ 
  href, 
  icon: Icon, 
  label, 
  isCollapsed, 
  isActive 
}: SidebarItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center p-3 mx-2 rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-accent",
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}