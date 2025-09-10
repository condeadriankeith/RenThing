"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Paintbrush, Check } from "lucide-react"

interface ThemeSelectorProps {
  currentTheme: string | null | undefined
  onThemeChange: (theme: string) => void
}

const themes = [
  { id: "default", name: "Default", colors: "bg-white dark:bg-gray-900" },
  { id: "blue", name: "Ocean Blue", colors: "bg-blue-50 dark:bg-blue-900" },
  { id: "green", name: "Forest Green", colors: "bg-green-50 dark:bg-green-900" },
  { id: "purple", name: "Royal Purple", colors: "bg-purple-50 dark:bg-purple-900" },
  { id: "pink", name: "Rose Pink", colors: "bg-pink-50 dark:bg-pink-900" },
  { id: "yellow", name: "Sunshine Yellow", colors: "bg-yellow-50 dark:bg-yellow-900" },
]

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || "default")

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)
    onThemeChange(themeId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Paintbrush className="h-4 w-4 mr-2" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((theme) => (
          <DropdownMenuItem 
            key={theme.id} 
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${theme.colors}`} />
              <span>{theme.name}</span>
            </div>
            {selectedTheme === theme.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}