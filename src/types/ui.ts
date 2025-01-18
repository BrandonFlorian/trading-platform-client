import { DexType } from "./crypto";

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  metadata_uri?: string;
}

export type ConnectionState = "connected" | "connecting" | "disconnected";

export type TradeType = "buy" | "sell";

export interface TokenRowProps {
  token: TokenInfo;
  onClickTrade: () => void;
}

export interface TokenTradeProps {
  token: TokenInfo;
  onTrade: (type: TradeType, amount: number, dex: DexType) => Promise<void>;
  isLoading?: boolean;
}

export interface TradeFormState {
  amount: string;
  slippage: number;
}

export interface ServerWalletState {
  error?: string;
  serverWallet: TokenInfo[] | null;
  isLoading: boolean;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
}