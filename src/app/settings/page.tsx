// src/app/settings/page.tsx
"use client"

import { SettingsTabs } from '@/components/settings/settings-tabs'
import { NotificationSkeletons } from "@/components/ui/loading-skeleton"

export default function SettingsPage() {
  const isLoading = false; // Replace with actual loading state

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>
      
      {isLoading ? (
        <NotificationSkeletons />
      ) : (
        <SettingsTabs />
      )}
    </div>
  )
}