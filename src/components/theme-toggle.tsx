"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  isCollapsed?: boolean
}

export function ThemeToggle({ isCollapsed }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={isCollapsed ? "icon" : "default"}
        className={cn(
          "w-full",
          isCollapsed ? "px-2" : "justify-start"
        )}
      >
        <Moon className="h-5 w-5" />
        {!isCollapsed && <span className="ml-3">Theme</span>}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size={isCollapsed ? "icon" : "default"}
      className={cn(
        "w-full",
        isCollapsed ? "px-2" : "justify-start"
      )}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Light Mode</span>}
        </>
      )}
    </Button>
  )
}