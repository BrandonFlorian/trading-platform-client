import { CopyTradeSettings, TokenInfo, WalletUpdate } from "./index";
import { DexType } from "./crypto";
export type ConnectionState = "connected" | "connecting" | "disconnected";

export interface TokenRowProps {
  token: TokenInfo;
  onClickTrade: () => void;
}

export interface TradeFormState {
  amount: string;
  slippage: number;
}

export interface ServerWalletState extends WalletTrackerState {
  error?: string;
}

// Extend the store state
export interface WalletTrackerState {
  serverWallet: WalletUpdate | null;
  isLoading: boolean;
  error?: string;
  copyTradeSettings: CopyTradeSettings | null;
  isSettingsEnabled: boolean;
  connectionStatus: ConnectionState;
  notifications: Notification[];
}

export type TradeType = "buy" | "sell";

export interface TokenTradeProps {
  token: TokenInfo;
  onTrade: (type: TradeType, amount: number, dex: DexType) => Promise<void>;
  isLoading?: boolean;
}
