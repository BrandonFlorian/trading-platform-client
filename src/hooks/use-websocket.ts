import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { CommandMessage } from "@/types/websocket";

const RECONNECT_DELAY = 5000;

const useWebsocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const { addNotification, setServerWallet, setConnectionStatus } =
    useWalletTrackerStore();

  const sendMessage = useCallback((message: CommandMessage) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    } else {
      toast.error("WebSocket is not connected");
    }
  }, []);

  const connect = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) return;

    websocketRef.current = new WebSocket(url);
    setConnectionStatus("connecting");

    websocketRef.current.onopen = () => {
      setIsConnected(true);
      setConnectionStatus("connected");
      sendMessage({ type: "start" });
    };

    websocketRef.current.onclose = () => {
      setIsConnected(false);
      setConnectionStatus("disconnected");

      // Clear any existing reconnection timeout
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }

      // Schedule reconnection
      reconnectTimeoutRef.current = window.setTimeout(() => {
        toast.info("Attempting to reconnect...");
        connect();
      }, RECONNECT_DELAY);
    };

    websocketRef.current.onmessage = (event) => {
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
  }, [url, setConnectionStatus, setServerWallet, addNotification, sendMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [connect]);

  return { sendMessage, isConnected };
};

export default useWebsocket;
