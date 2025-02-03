import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { CommandMessage } from "@/types/websocket";

const RECONNECT_DELAY = 5000;

interface WebSocketMessage {
  type: string;
  data?: any;
}

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const { addNotification, setServerWallet, setConnectionStatus } =
    useWalletTrackerStore();

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        reconnectAttempts.current = 0;
        toast.success("WebSocket connection established");
      };

      ws.current.onclose = (event) => {
        if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          setTimeout(connect, 3000);
          toast.error(`Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("WebSocket connection error");
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "wallet_update":
              setServerWallet(data.data);
              break;
            case "copy_trade_execution":
            case "tracked_wallet_trade":
            case "transaction_logged":
              addNotification({
                id: crypto.randomUUID(),
                type: "info",
                title: data.type.replace(/_/g, " ").toUpperCase(),
                message: `${data.data.transaction_type}: ${data.data.amount_token} ${data.data.token_symbol}`,
                timestamp: new Date(),
              });
              break;
            case "error":
              toast.error(data.data.message);
              break;
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      toast.error("Failed to connect to WebSocket");
    }
  }, [url, setServerWallet, addNotification]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    }
    toast.warning("Message not sent - connection not ready");
    return false;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      ws.current?.close();
    };
  }, [connect]);

  return {
    sendMessage,
    isConnected: ws.current?.readyState === WebSocket.OPEN
  };
};

export default useWebSocket;
