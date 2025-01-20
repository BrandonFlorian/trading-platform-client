import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationsPanelSkeleton = () => {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full bg-gradient-to-r from-muted to-muted/50" />
                        <Skeleton className="h-6 w-32 bg-gradient-to-r from-muted to-muted/50" />
                    </div>
                    <Skeleton className="h-8 w-20 bg-gradient-to-r from-muted to-muted/50" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 p-4 rounded-lg border border-muted/30"
                        >
                            <Skeleton className="h-4 w-4 rounded-full bg-gradient-to-r from-muted to-muted/50 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-24 bg-gradient-to-r from-muted to-muted/50" />
                                    <Skeleton className="h-5 w-16 rounded-full bg-gradient-to-r from-muted to-muted/50" />
                                </div>
                                <Skeleton className="h-4 w-full bg-gradient-to-r from-muted to-muted/50" />
                                <Skeleton className="h-3 w-20 bg-gradient-to-r from-muted to-muted/50" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationsPanelSkeleton;