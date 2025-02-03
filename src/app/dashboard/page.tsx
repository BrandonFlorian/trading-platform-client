import { MarketDataWidget } from '@/components/market/market-data-widget';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingCard, LoadingOverlay, LoadingSpinner } from '@/components/ui/loading'

const DashboardPage = () => {
    const { isLoading: loadingWatchlists } = useWatchlistStore();
    const { isLoading: loadingMarketData } = useMarketDataStore();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {/* Watchlist Panel */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Watchlists
                        {loadingWatchlists && <LoadingSpinner size="sm" />}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingWatchlists ? (
                        <LoadingCard rows={4} />
                    ) : (
            // ... existing watchlist content ...
          )}
                </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <LoadingOverlay loading={loadingMarketData}>
                    <MarketDataWidget key="market-data" />
                </LoadingOverlay>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Portfolio Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingMarketData ? (
                            <LoadingCard rows={6} />
                        ) : (
              // ... existing portfolio content ...
            )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 