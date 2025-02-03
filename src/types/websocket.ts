import { CopyTradeSettings } from ".";

export type CommandMessage = {
  type: "start" | "update_settings" | "refresh_state" | "manual_sell";
  settings?: CopyTradeSettings; // for update_settings
  token_address?: string; // for manual_sell
  amount?: number; // for manual_sell
  slippage?: number; // for manual_sell
};

export interface TradeMessage {
  type: 'BUY' | 'SELL' | 'UNDO_TRADE'
  id: string
  amount: number
  token: string
}

export interface PriceUpdateMessage {
  type: 'PRICE_UPDATE'
  data: {
    token: string
    price: number
  }
}

export type WebSocketMessage =
  | { type: 'CONFIRM_TRADE', id: string, amount: number, token: string }
  | { type: 'UNDO_TRADE', id: string }
  | { type: 'PRICE_UPDATE', data: { token: string, price: number } }
  | { type: 'WALLET_UPDATE', data: any }
  | { type: 'ERROR', message: string }
