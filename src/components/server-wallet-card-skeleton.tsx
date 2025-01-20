import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServerWalletCardSkeleton = () => {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <Skeleton className="h-8 w-32 bg-gradient-to-r from-muted to-muted/50" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-24 bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-8 w-32 bg-gradient-to-r from-muted to-muted/50" />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between py-2 px-2 border-b last:border-0 border-muted/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted to-muted/50" />
                                <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted to-muted/50" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right flex flex-col gap-1">
                                <Skeleton className="h-4 w-24 bg-gradient-to-r from-muted to-muted/50" />
                                <Skeleton className="h-4 w-16 bg-gradient-to-r from-muted to-muted/50" />
                            </div>
                            <Skeleton className="h-8 w-20 bg-gradient-to-r from-muted to-muted/50" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default ServerWalletCardSkeleton;