import { CopyTradeSettings } from ".";

export type CommandMessage = {
  type: "start" | "update_settings" | "refresh_state" | "manual_sell";
  settings?: CopyTradeSettings; // for update_settings
  token_address?: string; // for manual_sell
  amount?: number; // for manual_sell
  slippage?: number; // for manual_sell
};
