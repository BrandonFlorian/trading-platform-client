import { LoadingCard } from '@/components/ui/loading'

const TradeHistory = () => {
    const { trades, isLoading } = useTradeStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <LoadingCard rows={4} />
                ) : (
                    trades?.map((trade) => (
                        <TradeItem key={trade.id} trade={trade} />
                    ))
                )}
            </CardContent>
        </Card>
    );
}; 