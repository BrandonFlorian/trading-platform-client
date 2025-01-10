"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useWalletTrackerStore } from "@/stores/walletTrackerStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const settingsSchema = z.object({
  is_enabled: z.boolean(),
  trade_amount_sol: z
    .number()
    .min(0.001, "Minimum trade amount is 0.001 SOL")
    .max(10, "Maximum trade amount is 10 SOL"),
  max_slippage: z
    .number()
    .min(0.01, "Minimum slippage is 0.01%")
    .max(50, "Maximum slippage is 50%"),
  max_open_positions: z
    .number()
    .min(1, "Minimum positions is 1")
    .max(100, "Maximum positions is 100"),
  allow_additional_buys: z.boolean(),
  min_sol_balance: z.number().min(0.001, "Minimum balance is 0.001 SOL"),
});

export const CopyTradeSettingsForm = () => {
  const { copyTradeSettings, setCopyTradeSettings } = useWalletTrackerStore();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: copyTradeSettings || {
      is_enabled: false,
      trade_amount_sol: 0.001,
      max_slippage: 1.0,
      max_open_positions: 1,
      allow_additional_buys: false,
      min_sol_balance: 0.001,
    },
  });

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      const response = await fetch("/api/copy_trade_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      const savedSettings = await response.json();
      setCopyTradeSettings(savedSettings);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="is_enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable Copy Trading</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trade_amount_sol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade Amount (SOL)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.001"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </Form>
  );
};
