import { create } from 'zustand';
import { CandlestickData } from '@/hooks/use-price-feed-websocket';

interface PriceData {
    price_sol: number;
    price_usd?: number;
    liquidity?: number;
    liquidity_usd?: number;
    market_cap: number;
    timestamp: number;
}

interface PriceState {
    currentPrice: PriceData | null;
    candlesticks: CandlestickData[];
    isConnected: boolean;
    selectedToken: string | null;
    error: string | null;

    setCurrentPrice: (price: PriceData) => void;
    setCandlesticks: (candlesticks: CandlestickData[]) => void;
    setIsConnected: (isConnected: boolean) => void;
    setSelectedToken: (token: string) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const usePriceStore = create<PriceState>((set) => ({
    currentPrice: null,
    candlesticks: [],
    isConnected: false,
    selectedToken: null,
    error: null,

    setCurrentPrice: (price) => set({ currentPrice: price }),

    setCandlesticks: (candlesticks) => set({ candlesticks }),

    setIsConnected: (isConnected) => set({ isConnected }),

    setSelectedToken: (token) => set({ selectedToken: token }),

    setError: (error) => set({ error }),

    reset: () => set({
        currentPrice: null,
        candlesticks: [],
        isConnected: false,
        selectedToken: null,
        error: null,
    }),
}));