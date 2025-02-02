import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import CandlestickChart from '@/components/candlestick-chart';
import { TradePanel } from '@/components/dashboard/trade-panel';
import { useWatchlistStore } from '@/stores/watchlist-store';
import ReactDraggable from 'react-draggable';
import { WatchlistToken } from '@/stores/watchlist-store';

const TradePage = () => {
    const [tokenAddress, setTokenAddress] = useState<string>('');
    const { tokens, activeWatchlistId } = useWatchlistStore();

    return (
        <div className="h-screen w-full relative p-4 bg-background">
            {/* Draggable Watchlist */}
            {activeWatchlistId && (
                <ReactDraggable bounds="parent" handle=".handle">
                    <Card className="w-64 absolute right-4 top-4 z-50">
                        <div className="handle cursor-move p-4 border-b">
                            <h3 className="font-semibold">Watchlist</h3>
                        </div>
                        <div className="p-4 max-h-[600px] overflow-y-auto">
                            {tokens.map((token: WatchlistToken) => (
                                <div
                                    key={token.address}
                                    className="p-2 hover:bg-accent rounded cursor-pointer"
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
                    </Card>
                </ReactDraggable>
            )}

            {/* Main Trading Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                {/* Chart and Trade Panel */}
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                    <CandlestickChart tokenAddress={tokenAddress} />
                    <Card className="flex-1">
                        <Tabs defaultValue="trade" className="h-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="trade">Trade</TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                            </TabsList>
                            <TabsContent value="trade" className="h-full">
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
                            <TabsContent value="orders">{/* Order history component */}</TabsContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Market Data Column */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <Card className="p-4">
                        <h3 className="font-semibold mb-2">Market Depth</h3>
                        {/* Add market depth chart here */}
                    </Card>
                    <Card className="p-4 flex-1">
                        <h3 className="font-semibold mb-2">Recent Trades</h3>
                        {/* Add recent trades list here */}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TradePage; 