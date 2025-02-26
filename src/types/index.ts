// types/index.ts
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  metadata_uri?: string;
  decimals: number;
  market_cap: number;
}

export interface WalletUpdate {
  balance: number;
  tokens: TokenInfo[];
  address: string;
}

export interface CopyTradeSettings {
  id?: string;
  user_id?: string;
  tracked_wallet_id: string;
  is_enabled: boolean;
  trade_amount_sol: number;
  max_slippage: number;
  max_open_positions: number;
  allowed_tokens: string[];
  use_allowed_tokens_list: boolean;
  allow_additional_buys: boolean;
  match_sell_percentage: boolean;
  min_sol_balance: number;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
}
