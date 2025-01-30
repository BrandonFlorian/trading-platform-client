"use client"

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CreateWatchlistDialog() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { createWatchlist } = useWatchlistStore()

  const handleCreateWatchlist = async () => {
    if (!name.trim()) {
      toast.error('Watchlist name is required')
      return
    }

    try {
      await createWatchlist({ 
        name, 
        description: description || undefined 
      })
      
      toast.success('Watchlist created successfully')
      
      // Reset form
      setName('')
      setDescription('')
    } catch (error) {
      toast.error('Failed to create watchlist')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Watchlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Watchlist</DialogTitle>
          <DialogDescription>
            Create a new watchlist to track your favorite tokens
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter watchlist name"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional description"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleCreateWatchlist}
            disabled={!name.trim()}
          >
            Create Watchlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}