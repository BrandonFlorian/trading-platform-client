import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CopyTradeSettingsSkeleton = () => {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40 bg-gradient-to-r from-muted to-muted/50" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-6 w-10 bg-gradient-to-r from-muted to-muted/50" />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted to-muted/50" />
                            <Skeleton className="h-10 w-full bg-gradient-to-r from-muted to-muted/50" />
                        </div>
                    ))}

                    {[1, 2].map((i) => (
                        <div key={`switch-${i}`} className="flex items-center justify-between border-b border-muted/30 pb-4">
                            <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted to-muted/50" />
                            <Skeleton className="h-6 w-10 bg-gradient-to-r from-muted to-muted/50" />
                        </div>
                    ))}
                </div>

                <Skeleton className="h-10 w-full bg-gradient-to-r from-muted to-muted/50" />
            </CardContent>
        </Card>
    );
};

export default CopyTradeSettingsSkeleton;