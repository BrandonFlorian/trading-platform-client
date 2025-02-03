import { useRef, useEffect } from 'react'
import { TradeItem } from '@/types/trading'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useSmartRefresh } from '@/hooks/useSmartRefresh'
import { fetchTrades } from '@/services/trade-service'

interface Props {
    trades: TradeItem[]
    onLoadMore: () => void
}

export function TradeList({ trades, onLoadMore }: Props) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Intersection observer implementation
    }, [onLoadMore])

    return (
        <div className="space-y-4">
            {trades.map((trade) => (
                <TradeListItem key={trade.id} trade={trade} />
            ))}
            <div ref={loadMoreRef} className="h-4" />
        </div>
    )
}

interface TradeListItemProps {
    trade: TradeItem
}

function TradeListItem({ trade }: TradeListItemProps) {
    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
                <span>{trade.pair}</span>
                <span>{trade.side.toUpperCase()}</span>
            </div>
        </div>
    )
}

export const TradeListOld = () => {
    const { data: trades = [] } = useSmartRefresh('trades', fetchTrades)
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: trades.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 64,
        overscan: 5
    })

    return (
        <div ref={parentRef} className="h-[600px] overflow-auto">
            <div style={{ height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`
                        }}
                    >
                        <TradeListItem trade={trades[virtualItem.index]} />
                    </div>
                ))}
            </div>
        </div>
    )
} 