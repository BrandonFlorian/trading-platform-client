import React, { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'
import { TradeExecutionForm } from '@/components/trading/TradeExecutionForm'

interface RecoveryBoundaryProps {
    children: ReactNode
    retryFailedTrade: () => void
}

export const RecoveryBoundary = ({
    children,
    retryFailedTrade
}: RecoveryBoundaryProps) => (
    <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="p-4 bg-destructive/10">
                <h3 className="text-lg font-semibold mb-2">Trade Execution Failed</h3>
                <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
                <Button
                    onClick={() => {
                        resetErrorBoundary()
                        retryFailedTrade()
                    }}
                >
                    Retry Trade
                </Button>
            </div>
        )}
    >
        {children}
    </ErrorBoundary>
)

export default RecoveryBoundary 