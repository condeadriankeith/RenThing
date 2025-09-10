"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Image, 
  Upload, 
  Palette, 
  X, 
  Check 
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface BackgroundSelectorProps {
  currentBackground: string | null | undefined
  onBackgroundChange: (background: string | null) => void
}

const presetBackgrounds = [
  { id: "default", name: "Default", url: null },
  { id: "gradient-1", name: "Blue Gradient", url: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "gradient-2", name: "Sunset", url: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: "gradient-3", name: "Ocean", url: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { id: "gradient-4", name: "Forest", url: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { id: "gradient-5", name: "Purple", url: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
]

export function BackgroundSelector({ currentBackground, onBackgroundChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customUrl, setCustomUrl] = useState("")
  const [selectedBackground, setSelectedBackground] = useState(currentBackground || null)

  const handleBackgroundChange = (background: string | null) => {
    setSelectedBackground(background)
    onBackgroundChange(background)
    setIsOpen(false)
  }

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customUrl) {
      handleBackgroundChange(customUrl)
      setCustomUrl("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Image className="h-4 w-4 mr-2" />
            Background
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            <Palette className="h-4 w-4 mr-2" />
            Choose Background
          </DropdownMenuItem>
          {currentBackground && (
            <DropdownMenuItem onClick={() => handleBackgroundChange(null)}>
              <X className="h-4 w-4 mr-2" />
              Remove Background
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Background</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          {presetBackgrounds.map((bg) => (
            <div
              key={bg.id}
              className={`relative h-20 rounded-lg cursor-pointer border-2 ${
                selectedBackground === bg.url ? "border-blue-500" : "border-gray-200"
              }`}
              onClick={() => handleBackgroundChange(bg.url)}
              style={{ background: bg.url || "transparent" }}
            >
              {selectedBackground === bg.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                  <Check className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                {bg.name}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <Button type="submit" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Set
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}