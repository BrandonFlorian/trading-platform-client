// src/components/ui/loading.tsx
"use client"

import { cn } from "@/lib/utils"
import { Skeleton as UISkeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export const Skeleton = UISkeleton

export const LoadingSpinner = ({
    size = "default",
    className,
}: {
    size?: "sm" | "default" | "lg"
    className?: string
}) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
    }

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        </div>
    )
}

export const LoadingDots = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex space-x-1", className)}>
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="h-2 w-2 bg-current rounded-full animate-pulse"
                    style={{
                        animationDelay: `${i * 150}ms`,
                    }}
                />
            ))}
        </div>
    )
}

export const LoadingOverlay = ({
    children,
    loading,
    blur = false,
}: {
    children: React.ReactNode
    loading: boolean
    blur?: boolean
}) => {
    if (!loading) return <>{children}</>

    return (
        <div className="relative">
            {blur ? (
                <div className="blur-sm pointer-events-none">{children}</div>
            ) : (
                children
            )}
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        </div>
    )
}