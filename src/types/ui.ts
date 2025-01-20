import { TokenInfo as BaseTokenInfo, CopyTradeSettings } from "./index";
import { DexType } from "./crypto";

export type ConnectionState = "connected" | "connecting" | "disconnected";

export interface TokenRowProps {
  token: BaseTokenInfo;
  onClickTrade: () => Promise<void>;
}

export interface TradeFormState {
  amount: string;
  slippage: number;
}

export interface ServerWalletState extends WalletTrackerState {
  error?: string;
}

export interface WalletTrackerState {
  serverWallet: BaseTokenInfo | null;
  isLoading: boolean;
  error?: string;
  copyTradeSettings: CopyTradeSettings | null;
  isSettingsEnabled: boolean;
  connectionStatus: ConnectionState;
  notifications: Notification[];
}

export type TradeType = "buy" | "sell";

export interface TokenTradeProps {
  token: BaseTokenInfo;
  onTrade: (type: TradeType, amount: number, dex: DexType) => Promise<void>;
  isLoading?: boolean;
}