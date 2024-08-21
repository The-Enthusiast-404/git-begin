import { Moon, Sun } from "lucide-react"
import { Theme, useTheme } from "remix-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

function ThemeToggle() {
  const [theme, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {theme === Theme.LIGHT ? (
              <Sun
                className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100 border-none outline-none" />
            )
            : (
              <Moon
                className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100 border-none outline-none" />
            )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-2 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white"
      >
        <DropdownMenuItem
          onClick={() => setTheme(Theme.LIGHT)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(Theme.DARK)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
