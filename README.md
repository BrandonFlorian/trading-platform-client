# Solana DEX Trading Platform Frontend

A Next.js dashboard for managing and monitoring Solana DEX trading activities. Intended to be used with the [DEX Trading Platform Backend](https://github.com/BrandonFlorian/trading-platform).

NOTE: This is a work in progress and is not yet ready for production.

## Overview

This dashboard provides a real-time interface for:

- Monitoring wallet balances and token holdings
- Managing copy trade settings
- Executing trades on multiple DEXs (pump.fun, Raydium)
- Viewing trade history and notifications

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Real-time Updates**: WebSockets
- **Form Handling**: React Hook Form
- **Notifications**: Sonner

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

4. Run the development server:

```bash
npm run dev
```

## Features

### Server Wallet

- Real-time balance monitoring
- Token holdings display
- Trade execution interface for any token
- Support for multiple DEXs

### Copy Trade Settings

- Enable/disable copy trading
- Configure trade amounts and limits
- Set slippage tolerance
- Manage position limits
- Token allowlist support

### Notifications

- Real-time trade notifications
- Settings update confirmations
- Error notifications
- Connection status updates

## Project Structure

```
src/
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── server-wallet-card.tsx
│   │   ├── copy-trade-settings-panel.tsx
│   │   ├── notification-panel.tsx
│   │   └── ...
│   └── ui/                  # Reusable UI components (shadcn)
├── hooks/
│   └── useWebSocket.ts      # WebSocket connection management
├── stores/
│   └── walletTrackerStore.ts # Global state management
└── types/
    ├── index.ts             # Common types
    ├── ui.ts                # UI-specific types
    └── websocket.ts         # WebSocket types
```

## Component Usage

### Server Wallet Card

```tsx
import { ServerWalletCard } from "@/components/dashboard/server-wallet-card";

// Displays wallet balance and token holdings
```

### Copy Trade Settings

```tsx
import { CopyTradeSettingsPanel } from "@/components/dashboard/copy-trade-settings-panel";

// Manages copy trade configuration
```

### Trading Interface

```tsx
import { TradePanel } from "@/components/dashboard/trade-panel";

// Provides buy/sell interface for tokens
```

## State Management

The application uses Zustand for state management. Key stores include:

```typescript
// stores/walletTrackerStore.ts
interface WalletTrackerState {
  serverWallet: WalletUpdate | null;
  copyTradeSettings: CopyTradeSettings | null;
  // ... other state

  // Actions
  setCopyTradeSettings: (settings: CopyTradeSettings) => void;
  executeBuy: (address: string, amount: number) => Promise;
  executeSell: (address: string, amount: number) => Promise;
}
```

## WebSocket Integration

Real-time updates are handled through a WebSocket connection:

```typescript
// hooks/useWebSocket.ts
const useWebSocket = (url: string) => {
  // Manages WebSocket connection and message handling
  // Returns connection status and message sender
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
