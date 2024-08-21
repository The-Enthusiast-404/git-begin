import React from "react"
import { Moon, Sun } from "lucide-react"
import { Theme, useTheme } from "remix-themes"

import { Button } from "@/components/ui/button"

function ThemeToggle() {
  const [theme, setTheme] = useTheme()

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      {theme === Theme.LIGHT ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100 border-none outline-none" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100 border-none outline-none" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ThemeToggle
