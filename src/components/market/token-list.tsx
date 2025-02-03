// src/components/market/token-list.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingOverlay } from "@/components/ui/loading"
import { cn, formatBalance } from "@/lib/utils"
import { TokenInfo } from "@/types"
import { ArrowDown, ArrowUp } from "lucide-react"

interface TokenListProps {
    tokens: TokenInfo[]
    isLoading: boolean
    onSelectToken?: (token: TokenInfo) => void
}

interface TokenItemProps {
    token: TokenInfo
    onClick?: () => void
}

const TokenItem = ({ token, onClick }: TokenItemProps) => {
    const priceChange = Math.random() * 10 - 5 // Placeholder for price change
    const isPositive = priceChange >= 0

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer",
                "border-b last:border-0 border-border"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {token.name}
                    </div>
                </div>
            </div>

            <div className="text-right">
                <div className="font-medium">
                    {formatBalance(parseFloat(token.raw_balance), token.decimals)}
                </div>
                <div
                    className={cn(
                        "text-sm flex items-center gap-1 justify-end",
                        isPositive ? "text-green-500" : "text-red-500"
                    )}
                >
                    {isPositive ? (
                        <ArrowUp className="h-3 w-3" />
                    ) : (
                        <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(priceChange).toFixed(2)}%
                </div>
            </div>
        </div>
    )
}

export function TokenList({ tokens, isLoading, onSelectToken }: TokenListProps) {
    if (!tokens?.length && !isLoading) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    No tokens found
                </CardContent>
            </Card>
        )
    }

    return (
        <LoadingOverlay loading={isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle>Tokens</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {tokens.map((token) => (
                        <TokenItem
                            key={token.mint}
                            token={token}
                            onClick={() => onSelectToken?.(token)}
                        />
                    ))}
                </CardContent>
            </Card>
        </LoadingOverlay>
    )
}