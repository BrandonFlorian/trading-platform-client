import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TableRowLoading = () => {
    return (
        <div className="flex items-center space-x-4 p-4">
            <div className="w-4/12">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            </div>
            <div className="w-3/12">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            </div>
            <div className="w-3/12">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            </div>
            <div className="w-2/12">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            </div>
        </div>
    );
};

export const CardLoading = ({ rows = 3 }: { rows?: number }) => {
    return (
        <div className="space-y-4 p-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-[150px] animate-pulse rounded bg-muted"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-[80px] animate-pulse rounded bg-muted"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ButtonLoading = ({
    className,
    size = "default"
}: {
    className?: string;
    size?: "sm" | "default" | "lg";
}) => {
    const sizes = {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6"
    };

    return (
        <Loader2 className={cn("animate-spin", sizes[size], className)} />
    );
};

export const ChartLoading = () => {
    return (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
            <div className="text-center">
                <ButtonLoading size="lg" className="mb-2" />
                <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
        </div>
    );
};

export const ListLoading = ({ items = 5 }: { items?: number }) => {
    return (
        <div className="space-y-2">
            {Array.from({ length: items }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                    <div className="space-y-2">
                        <div className="h-4 w-[150px] animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-[100px] animate-pulse rounded bg-muted"></div>
                    </div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
                </div>
            ))}
        </div>
    );
};

export default {
    TableRowLoading,
    CardLoading,
    ButtonLoading,
    ChartLoading,
    ListLoading
};