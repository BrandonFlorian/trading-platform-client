import { Card } from "@tremor/react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

export const CopyTradingCard = () => (
    <Card>
        <CardHeader>
            <CardTitle>One-Click Copy Trading</CardTitle>
            <CardDescription className="text-muted-foreground">
                Follow expert traders with a single click
                <Tooltip>
                    <TooltipTrigger>
                        <Info size={16} className="ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>We automatically mirror trades in real-time</TooltipContent>
                </Tooltip>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ToggleGroup type="single" variant="outline">
                <ToggleGroupItem value="enabled">Enabled</ToggleGroupItem>
                <ToggleGroupItem value="disabled">Disabled</ToggleGroupItem>
            </ToggleGroup>
            <Collapsible>
                <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
                <CollapsibleContent>
                    <Separator className="my-4" />
                </CollapsibleContent>
            </Collapsible>
        </CardContent>
    </Card>
) 