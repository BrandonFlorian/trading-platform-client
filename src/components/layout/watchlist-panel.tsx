"use client"

import React, { useEffect, useState } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  Card, 
  CardContent 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  Star 
} from 'lucide-react'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { CreateWatchlistDialog } from '@/components/watchlist/create-watchlist-dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

interface WatchlistPanelProps {
  children?: React.ReactNode
}

export function WatchlistPanel({ children }: WatchlistPanelProps) {
  const { 
    tokens, 
    removeToken, 
    clearWatchlist, 
    fetchWatchlists,
    watchlists,
    activeWatchlistId,
    setActiveWatchlist,
    fetchWatchlistTokens
  } = useWatchlistStore()

  useEffect(() => {
    fetchWatchlists()
  }, [fetchWatchlists])

  useEffect(() => {
    if (activeWatchlistId) {
      fetchWatchlistTokens()
    }
  }, [activeWatchlistId, fetchWatchlistTokens])

  const handleRemoveToken = async (address: string) => {
    try {
      await removeToken(address)
      toast.success('Token removed from watchlist')
    } catch (error) {
      toast.error('Failed to remove token')
    }
  }

  const handleClearWatchlist = async () => {
    try {
      await clearWatchlist()
      toast.success('Watchlist cleared')
    } catch (error) {
      toast.error('Failed to clear watchlist')
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button 
            variant="ghost" 
            size="icon"
          >
            <Star className="h-6 w-6" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="h-[500px] overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>Watchlist</span>
            <div className="flex items-center gap-2">
              <CreateWatchlistDialog />
              {tokens.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleClearWatchlist}
                >
                  Clear All
                </Button>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Watchlist Selector */}
        <div className="my-4">
          <Select 
            value={activeWatchlistId} 
            onValueChange={setActiveWatchlist}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a watchlist" />
            </SelectTrigger>
            <SelectContent>
            {watchlists.map((list, index) => (
    <SelectItem 
      key={list.id || `watchlist-${index}`} 
      value={list.id || `watchlist-${index}`}
    >
      {list.name}
    </SelectItem>
  ))}
</SelectContent>
          </Select>
        </div>
        
        <Card className="mt-4 h-[calc(100%-200px)]">
          <CardContent className="p-0">
            {tokens.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No tokens in watchlist</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="divide-y">
                  {tokens.map((token) => (
                    <div 
                      key={token.address} 
                      className="flex items-center justify-between p-4 hover:bg-accent"
                    >
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.name}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveToken(token.address)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  )
}