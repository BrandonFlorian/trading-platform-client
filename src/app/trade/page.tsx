import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { ChartSkeletons, OrderBookSkeletons, TokenSkeletons } from "@/components/ui/loading-skeleton";

import { useWatchlistStore } from '@/stores/watchlist-store';
import { useTradeStore } from '@/stores/trade-store';
import type { WatchlistToken } from '@/stores/watchlist-store';

import CandlestickChart from '@/components/candlestick-chart';
import { TradePanel } from '@/components/dashboard/trade-panel';
import ReactDraggable from 'react-draggable';

const TradePage = () => {
    const [tokenAddress, setTokenAddress] = useState<string>('');
    const { tokens, activeWatchlistId, isLoading: loadingWatchlist } = useWatchlistStore();
    const { isExecutingTrade, setIsExecutingTrade } = useTradeStore();

    return (
        <div className="h-screen w-full relative p-4 bg-background">
            {/* Centered Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Tracked Wallet</h1>
                <p className="text-muted-foreground">Monitor and analyze wallet activity</p>
            </div>

            {/* Three Equal Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
                {/* Left Panel - Chart */}
                <Card className="flex flex-col">
                    <div className="flex-1 transition-opacity duration-300 ease-in-out">
                        {isExecutingTrade ? (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <ChartSkeletons />
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <CandlestickChart tokenAddress={tokenAddress} />
                            </div>
                        )}
                    </div>
                </Card>

                {/* Middle Panel - Trading Interface */}
                <Card className="flex flex-col">
                    <Tabs defaultValue="trade" className="h-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="trade">
                                {isExecutingTrade ? (
                                    <LoadingSpinner size="sm" className="mr-2" />
                                ) : (
                                    'Trade'
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                        </TabsList>
                        <TabsContent value="trade" className="flex-1">
                            {tokenAddress && (
                                <TradePanel
                                    token={{
                                        address: tokenAddress,
                                        symbol: tokens.find(t => t.address === tokenAddress)?.symbol || '',
                                        name: tokens.find(t => t.address === tokenAddress)?.name || '',
                                        balance: '0',
                                        decimals: 9,
                                        market_cap: tokens.find(t => t.address === tokenAddress)?.market_cap || 0
                                    }}
                                    onTrade={async () => { /* Add actual trade logic */ }}
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="orders" className="flex-1">
                            {/* Orders content */}
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* Right Panel - Market Data */}
                <Card className="flex flex-col">
                    {loadingWatchlist ? (
                        <div className="animate-in fade-in slide-in-from-bottom duration-500">
                            <OrderBookSkeletons />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom duration-500">
                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Market Depth</h3>
                                    {/* Market depth content */}
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Recent Trades</h3>
                                    {/* Recent trades content */}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Floating Watchlist */}
            {activeWatchlistId && (
                <ReactDraggable bounds="parent" handle=".handle">
                    <Card className="w-64 absolute right-4 top-4 z-50 transition-all duration-300 ease-in-out hover:shadow-lg">
                        <div className="handle cursor-move p-4 border-b">
                            <h3 className="font-semibold">Watchlist</h3>
                        </div>
                        <div className="p-4 max-h-[600px] overflow-y-auto">
                            {loadingWatchlist ? (
                                <div className="animate-in fade-in slide-in-from-right duration-500">
                                    <TokenSkeletons />
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-left duration-500">
                                    {tokens.map((token: WatchlistToken) => (
                                        <div
                                            key={token.address}
                                            className="p-2 hover:bg-accent rounded cursor-pointer transition-colors duration-200"
                                            onClick={() => setTokenAddress(token.address)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{token.symbol}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {token.price_sol?.toFixed(4)} SOL
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </ReactDraggable>
            )}
        </div>
    );
};

export default TradePage; 