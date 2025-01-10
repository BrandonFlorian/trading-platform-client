import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBalance(value: string | number, decimals = 6): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";

  // Handle small numbers
  if (Math.abs(num) < 0.000001) {
    return num.toExponential(2);
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export async function getKeyPairFromPrivateKey(key: string) {
  return Keypair.fromSecretKey(new Uint8Array(bs58.decode(key)));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getSolanaExplorerUrl(address: string) {
  return `https://explorer.solana.com/address/${address}`;
}

export function getSolanaExplorerTxUrl(txId: string) {
  return `https://explorer.solana.com/tx/${txId}`;
}

//copy to clipboard
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
