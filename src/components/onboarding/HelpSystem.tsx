import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"

export const HelpSystem = () => (
    <HoverCard>
        <HoverCardTrigger className="cursor-help">
            <Label>Risk Tolerance</Label>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="max-w-[300px]">
            <p className="text-sm">
                Lower values mean safer trades. Start conservative until you're comfortable.
            </p>
        </HoverCardContent>
    </HoverCard>
) 