import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CopyTradeSettings } from "@/types";

const convertSettingsToFormState = (settings: CopyTradeSettings) => ({
  is_enabled: Boolean(settings?.is_enabled),
  trade_amount_sol: settings?.trade_amount_sol?.toString() || "",
  max_slippage: settings?.max_slippage
    ? (settings.max_slippage * 100).toString()
    : "",
  max_open_positions: settings?.max_open_positions?.toString() || "",
  allow_additional_buys: Boolean(settings?.allow_additional_buys),
  use_allowed_tokens_list: Boolean(settings?.use_allowed_tokens_list),
  min_sol_balance: settings?.min_sol_balance?.toString() || "",
});

export const CopyTradeSettingsPanel = () => {
  const {
    copyTradeSettings: storedSettings,
    setCopyTradeSettings,
    isLoading,
  } = useWalletTrackerStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState(() =>
    storedSettings ? convertSettingsToFormState(storedSettings) : null
  );

  useEffect(() => {
    if (!formState && storedSettings) {
      // Only update if formState is null
      console.log("Initial settings load:", storedSettings);
      setFormState(convertSettingsToFormState(storedSettings));
    }
  }, [storedSettings, formState]);

  const handleUpdateSettings = (key: string, value: string | boolean) => {
    setFormState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSaveSettings = async () => {
    if (!storedSettings?.tracked_wallet_id || !formState) return;
    setIsSaving(true);

    try {
      const settingsToSave = {
        ...storedSettings,
        is_enabled: formState.is_enabled,
        trade_amount_sol: formState.trade_amount_sol
          ? parseFloat(formState.trade_amount_sol)
          : null,
        max_slippage: formState.max_slippage
          ? parseFloat(formState.max_slippage) / 100
          : null,
        max_open_positions: formState.max_open_positions
          ? parseInt(formState.max_open_positions)
          : null,
        allow_additional_buys: formState.allow_additional_buys,
        use_allowed_tokens_list: formState.use_allowed_tokens_list,
        min_sol_balance: formState.min_sol_balance
          ? parseFloat(formState.min_sol_balance)
          : null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/copy_trade_settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settingsToSave),
        }
      );

      if (!response.ok) throw new Error("Failed to save settings");
      const savedSettings = await response.json();

      setCopyTradeSettings(savedSettings);

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !storedSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Copy Trade Settings</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Enabled</span>
            <Switch
              checked={formState?.is_enabled || false}
              onCheckedChange={(checked) =>
                handleUpdateSettings("is_enabled", checked)
              }
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Trade Amount (SOL)</Label>
            <Input
              type="number"
              value={formState?.trade_amount_sol || ""}
              onChange={(e) =>
                handleUpdateSettings("trade_amount_sol", e.target.value)
              }
              placeholder="Enter amount in SOL"
              step="0.001"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Max Slippage (%)</Label>
            <Input
              type="number"
              value={formState?.max_slippage || ""}
              onChange={(e) =>
                handleUpdateSettings("max_slippage", e.target.value)
              }
              placeholder="Enter max slippage %"
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label>Max Open Positions</Label>
            <Input
              type="number"
              value={formState?.max_open_positions || ""}
              onChange={(e) =>
                handleUpdateSettings("max_open_positions", e.target.value)
              }
              placeholder="Enter max positions"
              min="1"
              step="1"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Allow Additional Buys</Label>
            <Switch
              checked={formState?.allow_additional_buys || false}
              onCheckedChange={(checked) =>
                handleUpdateSettings("allow_additional_buys", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Use Allowed Tokens List</Label>
            <Switch
              checked={formState?.use_allowed_tokens_list || false}
              onCheckedChange={(checked) =>
                handleUpdateSettings("use_allowed_tokens_list", checked)
              }
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};
