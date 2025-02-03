import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import throttle from 'lodash.throttle';

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
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_CANDLES = 100;
const CANDLE_INTERVAL = 60000; // 1 minute in milliseconds

const usePriceFeed = (
    baseUrl: string,
    tokenAddress: string | null
): PriceFeedHook => {
    const [isConnected, setIsConnected] = useState(false);
    const [priceData, setPriceData] = useState<PriceUpdate | null>(null);
    const [candlesticks, setCandlesticks] = useState<CandlestickData[]>([]);
    const candlesticksRef = useRef<CandlestickData[]>([]);
    const websocketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);

    const updateCandlesticksThrottled = useMemo(() => 
        throttle(
            (newCandles: CandlestickData[]) => {
                setCandlesticks([...newCandles]);
            },
            1000, // Update every 1000ms
            { leading: false, trailing: true }
        ),
    []
    );

    const updateOrCreateCandle = (price: number, timestamp: Date) => {
        const newCandles = [...candlesticksRef.current];

        if (newCandles.length === 0) {
            newCandles.push({
                x: timestamp,
                y: [price, price, price, price] // open, high, low, close
            });
        } else {
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
        }

        candlesticksRef.current = newCandles;
        updateCandlesticksThrottled(newCandles);
    };

    const connect = useCallback(() => {
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
                reconnectAttemptsRef.current = 0;
                toast.success(`Connected to price feed for ${tokenAddress}`);
            };

            websocketRef.current.onclose = (event: CloseEvent) => {
                setIsConnected(false);
                setPriceData(null);

                const closeInfo = {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                };
                console.log('WebSocket closed:', closeInfo);

                if (event.wasClean) {
                    toast.info('Connection closed');
                } else {
                    handleReconnect();
                }
            };

            websocketRef.current.onmessage = (event: MessageEvent) => {
                try {
                    const update: PriceUpdate = JSON.parse(event.data);
                    
                    // Validate price structure
                    if (typeof update.price_sol !== 'number' || update.price_sol <= 0) {
                        throw new Error(`Invalid price: ${update.price_sol}`);
                    }

                    // Validate timestamp (assuming UNIX seconds)
                    const now = Date.now();
                    const timestamp = new Date(update.timestamp * 1000);
                    if (Math.abs(now - timestamp.getTime()) > 60000) { // 1 minute tolerance
                        throw new Error(`Stale timestamp: ${timestamp}`);
                    }

                    setPriceData(update);
                    updateOrCreateCandle(update.price_sol, timestamp);
                } catch (error) {
                    console.error('Invalid price update:', error);
                }
            };

            websocketRef.current.onerror = (event: Event) => {
                // Handle different types of WebSocket errors
                let errorMessage = 'Unknown WebSocket error';
                let errorDetails = {};

                if (event instanceof ErrorEvent) {
                    errorMessage = event.message;
                    errorDetails = {
                        type: event.type,
                        error: event.error,
                        message: event.message
                    };
                } else if (event instanceof Event) {
                    errorDetails = {
                        type: event.type,
                        target: event.target
                    };
                }

                console.error('WebSocket error:', errorDetails);
                handleReconnect();
            };

        } catch (error) {
            console.error('Error creating WebSocket:', error);
            toast.error('Failed to create WebSocket connection');
            handleReconnect();
        }
    }, [baseUrl, tokenAddress]);

    // Separate reconnection logic
    const handleReconnect = useCallback(() => {
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            const attemptNumber = reconnectAttemptsRef.current + 1;
            toast.error(`Connection lost. Retrying... (${attemptNumber}/${MAX_RECONNECT_ATTEMPTS})`);

            if (reconnectTimeoutRef.current) {
                window.clearTimeout(reconnectTimeoutRef.current);
            }

            reconnectTimeoutRef.current = window.setTimeout(() => {
                reconnectAttemptsRef.current = attemptNumber;
                console.log(`Reconnection attempt ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS}`);
                connect();
            }, RECONNECT_DELAY);
        } else {
            toast.error('Maximum reconnection attempts reached. Please refresh the page.');
        }
    }, [connect]);

    // Cleanup function
    const cleanup = useCallback(() => {
        console.log('Cleaning up WebSocket connection');
        if (reconnectTimeoutRef.current) {
            window.clearTimeout(reconnectTimeoutRef.current);
        }
        if (websocketRef.current) {
            websocketRef.current.close();
        }
        setIsConnected(false);
        setPriceData(null);
        reconnectAttemptsRef.current = 0;
    }, []);

    useEffect(() => {
        const connectWebSocket = () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
            connect();
        };

        connectWebSocket();

        return () => {
            updateCandlesticksThrottled.cancel();
            if (websocketRef.current) {
                websocketRef.current.close();
                websocketRef.current = null;
            }
            candlesticksRef.current = [];
            setCandlesticks([]);
            setPriceData(null);
        };
    }, [tokenAddress]);

    return {
        priceData,
        isConnected,
        candlesticks: candlesticksRef.current
    };
};

export default usePriceFeed;