"use client";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { ConnectionStatus } from "@/components/dashboard/connection-status";
import { ServerWalletCard } from "@/components/dashboard/server-wallet-card";
import { CopyTradeSettingsPanel } from "@/components/dashboard/copy-trade-settings-panel";
import { NotificationsPanel } from "@/components/dashboard/notification-panel";
import { Loader2 } from "lucide-react";
import useWebsocket from "@/hooks/use-websocket";
import { useEffect } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export const Dashboard = () => {
  const {
    isLoading,
    connectionStatus,
    fetchWalletInfo,
    fetchCopyTradeSettings,
    serverWallet,
    copyTradeSettings,
  } = useWalletTrackerStore();
  const { isConnected } = useWebsocket(WS_URL);

  // Fetch initial data
  useEffect(() => {
    Promise.all([fetchWalletInfo(), fetchCopyTradeSettings()]);
  }, [fetchWalletInfo, fetchCopyTradeSettings]);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header with connection status */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center gap-4">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <ConnectionStatus status={connectionStatus} />
        </div>
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column - Wallet and Trading */}
        <div className="lg:col-span-8 space-y-6">
          {serverWallet && <ServerWalletCard />}
        </div>

        {/* Right column - Settings and Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {copyTradeSettings && <CopyTradeSettingsPanel />}
          <NotificationsPanel />
        </div>
      </div>

      {/* Websocket Connection Status */}
      {!isConnected && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
          Disconnected from server - Reconnecting...
        </div>
      )}
    </div>
  );
};
