import ThemeToggle from "~/components/ToggleTheme"
import { FaGithub } from "react-icons/fa"
import { Link } from "@remix-run/react"

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6">
      <div className="flex-grow text-center">
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "Edu VIC WA NT Beginner" }}
        >
          Git Begin
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="https://github.com/The-Enthusiast-404/git-begin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <FaGithub />
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default NavBar
