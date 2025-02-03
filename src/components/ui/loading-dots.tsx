// src/components/ui/loading-dots.tsx
import { cn } from "@/lib/utils"

interface LoadingDotsProps {
    size?: "small" | "default" | "large"
    color?: "default" | "primary" | "secondary"
    className?: string
}

export function LoadingDots({
    size = "default",
    color = "default",
    className
}: LoadingDotsProps) {
    const sizeClasses = {
        small: "h-1 w-1",
        default: "h-2 w-2",
        large: "h-3 w-3"
    }

    const colorClasses = {
        default: "bg-current",
        primary: "bg-primary",
        secondary: "bg-secondary"
    }

    return (
        <div className={cn("flex items-center space-x-1", className)}>
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "rounded-full animate-pulse",
                        sizeClasses[size],
                        colorClasses[color]
                    )}
                    style={{
                        animationDelay: `${i * 150}ms`
                    }}
                />
            ))}
        </div>
    )
}

export function DotsLoading() {
    return (
        <div className="flex items-center justify-center p-4">
            <LoadingDots />
        </div>
    )
}

export function LoadingText({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2">
            {children}
            <LoadingDots size="small" />
        </div>
    )
}