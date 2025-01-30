import { create } from "zustand";
import { WalletUpdate, CopyTradeSettings, Notification, TrackedWallet } from "@/types";
import { API_BASE_URL } from "@/config/constants";
import { DexType } from "@/types/crypto";

interface WalletTrackerState {
  // Server Wallet State
  serverWallet: WalletUpdate | null;
  isLoading: boolean;
  error: string | null;

  // Copy Trade Settings
  copyTradeSettings: CopyTradeSettings | null;
  isSettingsEnabled: boolean;

  // Connection Status
  connectionStatus: "connected" | "connecting" | "disconnected";

  // Notifications
  notifications: Notification[];

  // Tracked Wallets
  trackedWallets?: TrackedWallet[];

  // Actions
  setServerWallet: (wallet: WalletUpdate) => void;
  setCopyTradeSettings: (settings: CopyTradeSettings) => void;
  setConnectionStatus: (
    status: "connected" | "connecting" | "disconnected"
  ) => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  addTrackedWallet: (wallet: TrackedWallet) => void;

  fetchWalletInfo: () => Promise<void>;
  fetchCopyTradeSettings: () => Promise<void>;

  // Trading Actions
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
  isLoading: false,
  error: null,
  copyTradeSettings: null,
  isSettingsEnabled: false,
  connectionStatus: "disconnected",
  notifications: [],
  trackedWallets: [],

  setServerWallet: (wallet) => set({ serverWallet: wallet }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setError: (error: string) => set({ error }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
    })),

  addTrackedWallet: (wallet) => {
    set((state) => ({
      trackedWallets: [...(state.trackedWallets || []), wallet]
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  fetchWalletInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/info`);
      if (!response.ok) throw new Error("Failed to fetch wallet info");
      const data = await response.json();
      set({ serverWallet: data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch wallet info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCopyTradeSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/copy_trade_settings`
      );
      if (!response.ok) throw new Error("Failed to fetch copy trade settings");
      const [data] = await response.json();

      set({
        copyTradeSettings: data,
        isSettingsEnabled: data.is_enabled,
        isLoading: false,
      });
    } catch (error) {
      console.error("Fetch settings error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch settings",
        isLoading: false,
      });
    }
  },

  setCopyTradeSettings: (settings) => {
    set({
      copyTradeSettings: settings,
      isSettingsEnabled: settings?.is_enabled ?? false,
    });
  },
  executeBuy: async (
    tokenAddress: string,
    amount: number,
    slippageTolerance: number,
    dex: DexType
  ) => {
    set({ isLoading: true });
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
      get().addNotification({
        id: crypto.randomUUID(),
        type: "success",
        title: "Buy Executed",
        message: `Bought ${result.token_quantity} tokens for ${amount} SOL`,
        timestamp: new Date(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage });
      get().addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Buy Failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  executeSell: async (
    tokenAddress: string,
    amount: number,
    slippageTolerance: number,
    dex: DexType
  ) => {
    set({ isLoading: true });
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
      get().addNotification({
        id: crypto.randomUUID(),
        type: "success",
        title: "Sell Executed",
        message: `Sold ${amount} tokens for ${result.sol_received} SOL`,
        timestamp: new Date(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage });
      get().addNotification({
        id: crypto.randomUUID(),
        type: "error",
        title: "Sell Failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
