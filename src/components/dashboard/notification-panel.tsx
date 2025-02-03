"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { Bell, CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getNotificationBadge = (type: string) => {
  switch (type) {
    case "buy":
      return <Badge variant="default">Buy</Badge>;
    case "sell":
      return <Badge variant="destructive">Sell</Badge>;
    case "copy_trade":
      return <Badge variant="secondary">Copy Trade</Badge>;
    default:
      return <Badge>Info</Badge>;
  }
};

export function NotificationsPanel() {
  const { notifications, clearNotifications } = useWalletTrackerStore();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center flex justify-center items-center gap-2">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg",
                    "bg-card/50 border transition-colors",
                    "hover:bg-accent/50"
                  )}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{notification.title}</p>
                      {getNotificationBadge(notification.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
