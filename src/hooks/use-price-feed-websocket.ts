import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface CandlestickData {
    x: Date;
    y: [number, number, number, number]; // [open, high, low, close]
}

export interface PriceUpdate {
    price_sol: number;
    price_usd?: number;
    liquidity?: number;
    liquidity_usd?: number;
    market_cap: number;
    timestamp: number;
}

interface PriceFeedHook {
    priceData: PriceUpdate | null;
    isConnected: boolean;
    candlesticks: CandlestickData[];
}

const RECONNECT_DELAY = 5000;
const MAX_CANDLES = 100;
const CANDLE_INTERVAL = 60000; // 1 minute in milliseconds

const usePriceFeed = (
    baseUrl: string,
    tokenAddress: string | null
): PriceFeedHook => {
    const [isConnected, setIsConnected] = useState(false);
    const [priceData, setPriceData] = useState<PriceUpdate | null>(null);
    const [candlesticks, setCandlesticks] = useState<CandlestickData[]>([]);
    const websocketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const updateOrCreateCandle = (price: number, timestamp: Date) => {
        setCandlesticks(prevCandles => {
            const newCandles = [...prevCandles];

            if (newCandles.length === 0) {
                return [{
                    x: timestamp,
                    y: [price, price, price, price] // open, high, low, close
                }];
            }

            const lastCandle = newCandles[newCandles.length - 1];
            const timeDiff = timestamp.getTime() - lastCandle.x.getTime();

            if (timeDiff < CANDLE_INTERVAL) {
                // Update existing candle
                lastCandle.y[1] = Math.max(lastCandle.y[1], price); // Update high
                lastCandle.y[2] = Math.min(lastCandle.y[2], price); // Update low
                lastCandle.y[3] = price; // Update close
                newCandles[newCandles.length - 1] = lastCandle;
            } else {
                // Create new candle
                newCandles.push({
                    x: timestamp,
                    y: [price, price, price, price]
                });

                // Keep only last MAX_CANDLES
                if (newCandles.length > MAX_CANDLES) {
                    newCandles.shift();
                }
            }

            return newCandles;
        });
    };

    const connect = () => {
        if (!tokenAddress) return;
        if (websocketRef.current?.readyState === WebSocket.OPEN) return;

        try {
            const wsUrl = new URL('/ws', baseUrl);
            wsUrl.searchParams.set('token', tokenAddress);

            console.log('Connecting to WebSocket:', wsUrl.toString());
            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                toast.success(`Connected to price feed for ${tokenAddress}`);
            };

            websocketRef.current.onclose = () => {
                console.log('WebSocket closed');
                setIsConnected(false);
                setPriceData(null);

                if (reconnectTimeoutRef.current) {
                    window.clearTimeout(reconnectTimeoutRef.current);
                }

                if (tokenAddress) {
                    reconnectTimeoutRef.current = window.setTimeout(() => {
                        console.log('Attempting to reconnect...');
                        connect();
                    }, RECONNECT_DELAY);
                }
            };

            websocketRef.current.onmessage = (event) => {
                try {
                    const update: PriceUpdate = JSON.parse(event.data);
                    console.log('Received price update:', update);

                    setPriceData(update);
                    const timestamp = new Date(update.timestamp * 1000);
                    updateOrCreateCandle(update.price_sol, timestamp);
                } catch (error) {
                    console.error('Error processing price update:', error);
                    toast.error('Failed to process price update');
                }
            };

            websocketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                toast.error('Price feed connection error');
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            toast.error('Failed to create WebSocket connection');
        }
    };

    useEffect(() => {
        connect();

        return () => {
            console.log('Cleaning up WebSocket connection');
            if (reconnectTimeoutRef.current) {
                window.clearTimeout(reconnectTimeoutRef.current);
            }
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [tokenAddress]);

    return {
        priceData,
        isConnected,
        candlesticks
    };
};

export default usePriceFeed;