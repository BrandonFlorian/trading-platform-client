// src/components/settings/general-settings.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '../theme-toggle'

export function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme
            </p>
          </div>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  )
}