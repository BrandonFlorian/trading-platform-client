"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart2, 
  WalletCards, 
  Search, 
  Settings,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WatchlistButton } from '@/components/watchlist/watchlist-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'

const NAVIGATION_ITEMS = [
  {
    label: 'Trading',
    href: '/trading',
    icon: BarChart2
  },
  {
    label: 'Tracked Wallets',
    href: '/tracked-wallets',
    icon: WalletCards
  },
  {
    label: 'Wallet Lookup',
    href: '/wallet-lookup',
    icon: Search
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  return (
    <>
      <aside 
        className={cn(
          "relative flex h-screen flex-col border-r bg-background",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {!isCollapsed && <span className="font-semibold">Trading App</span>}
        </div>
        
        <nav className="flex-1 space-y-1 p-2">
          {NAVIGATION_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === href 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-2 space-y-2">
          <Separator />
          {!isCollapsed && <WatchlistButton />}
          <ThemeToggle isCollapsed={isCollapsed} />
        </div>
      </aside>
      
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}