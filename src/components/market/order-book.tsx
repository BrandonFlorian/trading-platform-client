// src/components/market/order-book.tsx
import { OrderBookProps, OrderBookEntry } from "@/types/market"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingOverlay } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

export const OrderBook = ({ bids, asks, isLoading, depth = 10 }: OrderBookProps) => {
    const maxTotal = Math.max(
        ...bids.map((bid) => bid.total),
        ...asks.map((ask) => ask.total)
    )

    const OrderRow = ({
        entry,
        side,
        maxTotal
    }: {
        entry: OrderBookEntry
        side: "bid" | "ask"
        maxTotal: number
    }) => {
        const percentage = (entry.total / maxTotal) * 100
        const bgColorClass = side === "bid"
            ? "bg-green-500/10"
            : "bg-red-500/10"

        return (
            <div className="relative grid grid-cols-3 py-1 text-sm">
                <div
                    className={cn(
                        "absolute inset-0 opacity-50",
                        bgColorClass
                    )}
                    style={{
                        width: `${percentage}%`,
                        [side === "bid" ? "left" : "right"]: 0
                    }}
                />
                <span className={cn(
                    "z-10",
                    side === "bid" ? "text-green-500" : "text-red-500"
                )}>
                    {entry.price.toFixed(2)}
                </span>
                <span className="z-10 text-center">{entry.size.toFixed(4)}</span>
                <span className="z-10 text-right">{entry.total.toFixed(4)}</span>
            </div>
        )
    }

    return (
        <LoadingOverlay loading={isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle>Order Book</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 text-xs text-muted-foreground">
                            <span>Price</span>
                            <span className="text-center">Size</span>
                            <span className="text-right">Total</span>
                        </div>

                        <div className="space-y-1">
                            {asks.slice(0, depth).reverse().map((ask, i) => (
                                <OrderRow
                                    key={i}
                                    entry={ask}
                                    side="ask"
                                    maxTotal={maxTotal}
                                />
                            ))}
                        </div>

                        <div className="border-y border-border py-2 text-center font-medium">
                            {((bids[0]?.price + asks[0]?.price) / 2).toFixed(2)}
                        </div>

                        <div className="space-y-1">
                            {bids.slice(0, depth).map((bid, i) => (
                                <OrderRow
                                    key={i}
                                    entry={bid}
                                    side="bid"
                                    maxTotal={maxTotal}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </LoadingOverlay>
    )
}