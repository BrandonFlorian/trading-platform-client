import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { Star, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

const WatchlistManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('')
  
  const {
    watchlists,
    tokens,
    activeWatchlistId,
    fetchWatchlists,
    setActiveWatchlist,
    createWatchlist,
    deleteWatchlist,
    fetchWatchlistTokens,
    removeToken
  } = useWatchlistStore()

  useEffect(() => {
    fetchWatchlists()
  }, [fetchWatchlists])

  useEffect(() => {
    if (activeWatchlistId) {
      fetchWatchlistTokens()
    }
  }, [activeWatchlistId, fetchWatchlistTokens])

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      toast.error('Watchlist name is required')
      return
    }
  
    try {
      // Add proper typing to the created watchlist
      const createdWatchlist = await createWatchlist({
        name: newWatchlistName,
        description: newWatchlistDescription || undefined
      })
  
      setIsCreateDialogOpen(false)
      setNewWatchlistName('')
      setNewWatchlistDescription('')
      
      if (createdWatchlist?.id) { // Add null check
        setActiveWatchlist(createdWatchlist.id)
      }
      
      toast.success('Watchlist created successfully')
    } catch (error) {
      toast.error('Failed to create watchlist')
    }
  }

  const handleDeleteWatchlist = async () => {
    if (!activeWatchlistId) {
      toast.error('No watchlist selected')
      return
    }
    
    try {
      await deleteWatchlist(activeWatchlistId)
      toast.success('Watchlist deleted successfully')
      
      // Reset state after deletion
      await fetchWatchlists()
    } catch (error) {
      toast.error('Failed to delete watchlist')
    }
  }

  const handleRemoveToken = async (address: string) => {
    if (!activeWatchlistId) {
      toast.error('No active watchlist')
      return
    }

    try {
      await removeToken(address)
      toast.success('Token removed from watchlist')
    } catch (error) {
      toast.error('Failed to remove token')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-1">
          <Select 
            value={activeWatchlistId || ''} 
            onValueChange={setActiveWatchlist}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a watchlist" />
            </SelectTrigger>
            <SelectContent>
              {watchlists.map((list, index) => (
                <SelectItem 
                  key={list.id || `watchlist-${index}`} 
                  value={list.id || `temp-${index}`}
                >
                  {list.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeWatchlistId && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteWatchlist}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="Enter watchlist name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newWatchlistDescription}
                  onChange={(e) => setNewWatchlistDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleCreateWatchlist} 
                disabled={!newWatchlistName.trim()}
              >
                Create Watchlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            {tokens.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No tokens in watchlist</p>
              </div>
            ) : (
              <div className="divide-y">
                {tokens.map((token, index) => (
                  <div
                    key={`${token.address}-${index}`}
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
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex items-center space-x-2">
  {watchlists.map((list) => (
    <div 
      key={list.id} // Use the watchlist ID as key
      className="flex items-center space-x-2 p-2 border rounded-md"
    >
      <Checkbox
        id={`watchlist-${list.id}`}
        checked={activeWatchlistId === list.id}
        onCheckedChange={(checked) => {
          if (checked) {
            setActiveWatchlist(list.id)
          }
        }}
      />
      <Label 
        htmlFor={`watchlist-${list.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {list.name}
      </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchlistManager