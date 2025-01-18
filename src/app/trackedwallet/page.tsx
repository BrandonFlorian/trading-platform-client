import { TrackedWalletCard } from "@/components/tracked-wallet/tracked-wallet-card";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-purple-100 via-white to-blue-100 dark:from-purple-900 dark:via-gray-900 dark:to-blue-900">
      <TrackedWalletCard />
    </main>
  );
}