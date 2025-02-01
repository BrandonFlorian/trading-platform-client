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
      const createdWatchlist = await createWatchlist({
        name: newWatchlistName,
        description: newWatchlistDescription || undefined
      })
  
      setIsCreateDialogOpen(false)
      setNewWatchlistName('')
      setNewWatchlistDescription('')
      
      if (createdWatchlist?.id) {
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
    } catch (error) {
      toast.error('Failed to delete watchlist')
    }
  }

  const handleRemoveToken = async (address: string) => {
    try {
      await removeToken(address)
      toast.success('Token removed from watchlist')
    } catch (error) {
      toast.error('Failed to remove token')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="Enter watchlist name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newWatchlistDescription}
                  onChange={(e) => setNewWatchlistDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWatchlist}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {activeWatchlistId && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteWatchlist}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Watchlist
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {watchlists.map((list) => (
          <div 
            key={`watchlist-${list.id}`}
            className="flex items-center space-x-2 p-2 border rounded-md"
          >
            <Checkbox
              id={`watchlist-checkbox-${list.id}`}
              checked={activeWatchlistId === list.id}
              onCheckedChange={(checked) => {
                if (checked) {
                  setActiveWatchlist(list.id)
                }
              }}
            />
            <Label 
              htmlFor={`watchlist-checkbox-${list.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {list.name}
            </Label>
          </div>
        ))}
      </div>

      {activeWatchlistId && tokens.length > 0 && (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {tokens.map((token) => (
              <Card key={`token-${token.address}`}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
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
    </div>
  )
}

export default WatchlistManager