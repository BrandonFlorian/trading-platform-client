import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentErrorProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ComponentError = ({
    title = "Error",
    message,
    onRetry,
    className,
}: ComponentErrorProps) => {
    return (
        <Card className={cn("border-destructive/50", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{message}</p>
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="w-full"
                    >
                        Try Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};