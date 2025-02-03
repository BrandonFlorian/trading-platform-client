import { Button } from '@/components/ui/button'
import { Plus, Rocket, WalletCards } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

export const FloatingActions = () => (
    <div className="fixed bottom-8 right-8 flex gap-2 items-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    size="lg"
                    className="rounded-full"
                >
                    {/* Add your content here */}
                </Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
    </div>
) 