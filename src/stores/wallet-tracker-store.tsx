import { create } from "zustand";
import { WalletUpdate, CopyTradeSettings, Notification } from "@/types";
import { API_BASE_URL } from "@/config/constants";
import { DexType } from "@/types/crypto";

interface LoadingStates {
  walletInfo: boolean;
  copyTradeSettings: boolean;
  notifications: boolean;
  trade: boolean;
}

interface WalletTrackerState {
  serverWallet: WalletUpdate | null;
  error: string | null;
  copyTradeSettings: CopyTradeSettings | null;
  isSettingsEnabled: boolean;
  connectionStatus: "connected" | "connecting" | "disconnected";
  notifications: Notification[];
  loadingStates: LoadingStates;

  setServerWallet: (wallet: WalletUpdate) => void;
  setCopyTradeSettings: (settings: CopyTradeSettings) => void;
  setConnectionStatus: (status: "connected" | "connecting" | "disconnected") => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  setLoading: (component: keyof LoadingStates, isLoading: boolean) => void;

  fetchWalletInfo: () => Promise<void>;
  fetchCopyTradeSettings: () => Promise<void>;

  executeBuy: (
    tokenAddress: string,
    amount: number,
    slippageTolerance: number,
    dex: DexType
  ) => Promise<void>;
  executeSell: (
    tokenAddress: string,
    amount: number,
    slippageTolerance: number,
    dex: DexType
  ) => Promise<void>;
}

export const useWalletTrackerStore = create<WalletTrackerState>((set, get) => ({
  serverWallet: null,
  error: null,
  copyTradeSettings: null,
  isSettingsEnabled: false,
  connectionStatus: "disconnected",
  notifications: [],
  loadingStates: {
    walletInfo: false,
    copyTradeSettings: false,
    notifications: false,
    trade: false,
  },

  setLoading: (component, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [component]: isLoading,
      },
    })),

  setServerWallet: (wallet) => set({ serverWallet: wallet }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    })),
  clearNotifications: () => set({ notifications: [] }),

  fetchWalletInfo: async () => {
    const { setLoading } = get();
    setLoading("walletInfo", true);
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/info`);
      if (!response.ok) throw new Error("Failed to fetch wallet info");
      const data = await response.json();
      set({ serverWallet: data });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch wallet info",
      });
    } finally {
      setLoading("walletInfo", false);
    }
  },

  fetchCopyTradeSettings: async () => {
    const { setLoading } = get();
    setLoading("copyTradeSettings", true);
    try {
      const response = await fetch(`${API_BASE_URL}/copy_trade_settings`);
      if (!response.ok) throw new Error("Failed to fetch copy trade settings");
      const [data] = await response.json();
      set({
        copyTradeSettings: data,
        isSettingsEnabled: data.is_enabled,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch settings",
      });
    } finally {
      setLoading("copyTradeSettings", false);
    }
  },

  setCopyTradeSettings: (settings) => {
    set({
      copyTradeSettings: settings,
      isSettingsEnabled: settings?.is_enabled ?? false,
    });
  },

  executeBuy: async (tokenAddress, amount, slippageTolerance, dex) => {
    const { setLoading, addNotification } = get();
    setLoading("trade", true);
    try {
      const response = await fetch(`${API_BASE_URL}/${dex}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_address: tokenAddress,
          sol_quantity: amount,
          slippage_tolerance: slippageTolerance,
        }),
      });

      if (!response.ok) throw new Error("Buy failed");

      const result = await response.json();
      addNotification({
        id: crypto.randomUUID(),
        type: "success",
        title: "Buy Executed",
        message: `Bought ${result.token_quantity} tokens for ${amount} SOL`,
        timestamp: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage });
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Buy Failed",
        message: errorMessage,
        timestamp: new Date(),
      });
    } finally {
      setLoading("trade", false);
    }
  },

  executeSell: async (tokenAddress, amount, slippageTolerance, dex) => {
    const { setLoading, addNotification } = get();
    setLoading("trade", true);
    try {
      const response = await fetch(`${API_BASE_URL}/${dex}/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_address: tokenAddress,
          token_quantity: amount,
          slippage_tolerance: slippageTolerance,
        }),
      });

      if (!response.ok) throw new Error("Sell failed");

      const result = await response.json();
      addNotification({
        id: crypto.randomUUID(),
        type: "success",
        title: "Sell Executed",
        message: `Sold ${amount} tokens for ${result.sol_received} SOL`,
        timestamp: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage });
      addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Sell Failed",
        message: errorMessage,
        timestamp: new Date(),
      });
    } finally {
      setLoading("trade", false);
    }
  },
}));