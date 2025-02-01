// types/index.ts
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  metadata_uri?: string;
  decimals: number;
  market_cap: number;
  price?: number;
  logo?: string;
}

export interface WalletDetailsMetadata {
  mint: string;
  symbol: string;
  name: string;
  raw_balance: string;
  uri?: string;
  decimals: number;
  market_cap: number;
  price?: number;
  logo?: string;
}

export interface WalletUpdate {
  balance: number;
  tokens: WalletDetailsMetadata[];
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

export interface WalletLookupResult {
  address: string;
  solBalance: number;
  tokens: TokenInfo[];
}

export interface TrackedWallet {
  id?: string;
  user_id?: string;
  wallet_address: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WatchlistToken {
  address: string;
  symbol: string;
  name: string;
  balance?: string;
  market_cap?: number;
  decimals?: number;
}