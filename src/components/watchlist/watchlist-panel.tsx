import { useEffect } from 'react'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface WatchlistPanelProps {
  children?: React.ReactNode
}

export function WatchlistPanel({ children }: WatchlistPanelProps) {
  const { 
    tokens, 
    removeToken, 
    fetchWatchlists,
    watchlists,
    activeWatchlistId,
    setActiveWatchlist,
    fetchWatchlistTokens,
    isLoading
  } = useWatchlistStore()

  useEffect(() => {
    console.log('Fetching watchlists')
    fetchWatchlists()
  }, [fetchWatchlists])

  useEffect(() => {
    if (activeWatchlistId) {
      console.log('Fetching tokens for watchlist:', activeWatchlistId)
      console.log('Current tokens before fetch:', tokens)
      fetchWatchlistTokens()
    }
  }, [activeWatchlistId, fetchWatchlistTokens])

  useEffect(() => {
    console.log('Tokens updated:', tokens)
  }, [tokens])

  const handleRemoveToken = async (address: string) => {
    try {
      await removeToken(address)
      toast.success('Token removed from watchlist')
    } catch (error) {
      toast.error('Failed to remove token')
    }
  }

  if (!activeWatchlistId) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Select a watchlist to view tokens</p>
      </div>
    )
  }

  console.log('Rendering with tokens:', tokens)

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Loading tokens...</p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No tokens in watchlist</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {tokens.map((token) => (
              <Card key={`token-${token.address}`}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <div className="font-medium">{token.symbol || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.name || token.address}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveToken(token.address)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      {children}
    </div>
  )
}