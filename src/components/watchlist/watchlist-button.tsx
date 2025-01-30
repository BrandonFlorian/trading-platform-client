import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Star } from 'lucide-react'
import WatchlistManager from './watchlist-manager'

export const WatchlistButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-start">
          <Star className="h-5 w-5 mr-3" />
          Manage Watchlists
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Manage Watchlists</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <WatchlistManager />
        </div>
      </SheetContent>
    </Sheet>
  )
}