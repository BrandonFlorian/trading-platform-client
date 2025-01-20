import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { toast } from "sonner";
import { CopyTradeSettings } from "@/types";
import CopyTradeSettingsSkeleton from "@/components/copy-trade-settings-skeleton";
import { ComponentError } from "@/components/ui/error/component-error";

interface FormState {
  is_enabled: boolean;
  trade_amount_sol: string;
  max_slippage: string;
  max_open_positions: string;
  allow_additional_buys: boolean;
  use_allowed_tokens_list: boolean;
  min_sol_balance: string;
}

const convertSettingsToFormState = (settings: CopyTradeSettings): FormState => ({
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
    loadingStates,
    error,
    fetchCopyTradeSettings
  } = useWalletTrackerStore();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState | null>(() =>
    storedSettings ? convertSettingsToFormState(storedSettings) : null
  );

  if (loadingStates.copyTradeSettings) {
    return <CopyTradeSettingsSkeleton />;
  }

  if (error) {
    return (
      <ComponentError
        title="Failed to Load Settings"
        message={error}
        onRetry={fetchCopyTradeSettings}
      />
    );
  }

  if (!formState || !storedSettings) {
    return (
      <ComponentError
        title="Settings Unavailable"
        message="Could not load copy trade settings. Please try again later."
        onRetry={fetchCopyTradeSettings}
      />
    );
  }

  const handleUpdateSettings = (key: keyof FormState, value: string | boolean) => {
    setFormState((prev) => prev ? { ...prev, [key]: value } : prev);
    setSaveError(null);
  };

  const validateSettings = (settings: FormState) => {
    if (settings.trade_amount_sol && parseFloat(settings.trade_amount_sol) <= 0) {
      throw new Error("Trade amount must be greater than 0");
    }
    if (settings.max_slippage && (parseFloat(settings.max_slippage) <= 0 || parseFloat(settings.max_slippage) > 100)) {
      throw new Error("Slippage must be between 0 and 100");
    }
    if (settings.max_open_positions && parseInt(settings.max_open_positions) <= 0) {
      throw new Error("Maximum open positions must be greater than 0");
    }
    if (settings.min_sol_balance && parseFloat(settings.min_sol_balance) < 0) {
      throw new Error("Minimum SOL balance cannot be negative");
    }
  };

  const handleSaveSettings = async () => {
    if (!storedSettings?.tracked_wallet_id || !formState) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      validateSettings(formState);

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to save settings");
      }

      const savedSettings = await response.json();
      setCopyTradeSettings(savedSettings);
      toast.success("Settings saved successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save settings";
      setSaveError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Copy Trade Settings</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Enabled</span>
            <Switch
              checked={formState.is_enabled}
              onCheckedChange={(checked) =>
                handleUpdateSettings("is_enabled", checked)
              }
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {saveError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {saveError}
          </div>
        )}

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Trade Amount (SOL)</Label>
            <Input
              type="number"
              value={formState.trade_amount_sol}
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
              value={formState.max_slippage}
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
              value={formState.max_open_positions}
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
              checked={formState.allow_additional_buys}
              onCheckedChange={(checked) =>
                handleUpdateSettings("allow_additional_buys", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Use Allowed Tokens List</Label>
            <Switch
              checked={formState.use_allowed_tokens_list}
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