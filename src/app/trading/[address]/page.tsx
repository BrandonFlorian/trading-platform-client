"use client"

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import CandlestickChart from '@/components/candlestick-chart';
import { TradePanel } from '@/components/dashboard/trade-panel';
import { useWatchlistStore } from '@/stores/watchlist-store';
import WatchlistManager from '@/components/watchlist/watchlist-manager';
import { ChartSkeletons, TokenSkeletons } from "@/components/ui/loading-skeleton"

const TradingPage = () => {
    const { address } = useParams<{ address: string }>();
    const { tokens, fetchWatchlistTokens, activeWatchlistId } = useWatchlistStore();
    const currentToken = tokens.find(t => t.address === address);
    const isLoading = false; // Replace with actual loading state

    return (
        <div className="h-screen w-full relative p-4 bg-background">
            {isLoading ? (
                <div className="space-y-6">
                    <ChartSkeletons />
                    <TokenSkeletons />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                    {/* Chart and Trade Panel */}
                    <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                        <CandlestickChart tokenAddress={address} />
                        <Card className="flex-1">
                            <Tabs defaultValue="trade" className="h-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="trade">Trade</TabsTrigger>
                                    <TabsTrigger value="orders">Orders</TabsTrigger>
                                </TabsList>
                                <TabsContent value="trade" className="h-full">
                                    {address && currentToken && (
                                        <TradePanel
                                            token={{
                                                address,
                                                symbol: currentToken.symbol,
                                                name: currentToken.name,
                                                balance: currentToken.balance || '0',
                                                decimals: 9,
                                                market_cap: currentToken.market_cap || 0
                                            }}
                                            onTrade={async (type, amount, dex) => {
                                                return Promise.resolve();
                                            }}
                                        />
                                    )}
                                </TabsContent>
                                <TabsContent value="orders">{/* Order history */}</TabsContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Market Data Column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-2">Market Depth</h3>
                        </Card>
                        <Card className="p-4 flex-1">
                            <h3 className="font-semibold mb-2">Recent Trades</h3>
                        </Card>
                        <Card className="p-4">
                            <WatchlistManager />
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradingPage; 