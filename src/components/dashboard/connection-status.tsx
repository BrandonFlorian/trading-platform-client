"use client";

import { cn } from "@/lib/utils";
import { ConnectionState } from "@/types/ui";

export const ConnectionStatus = ({ status }: { status: ConnectionState }) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-background border">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          status === "connected" && "bg-green-500",
          status === "connecting" && "bg-yellow-500",
          status === "disconnected" && "bg-red-500"
        )}
      />
      <span className="capitalize">{status}</span>
    </div>
  );
};
