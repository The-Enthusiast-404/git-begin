import ThemeToggle from "~/components/ToggleTheme"
import GitHubButton from "react-github-btn"
import ChangeLanguage from "~/components/ChangeLanguage"

const NavBar = () => {
  return (
    <nav className="flex flex-col md:flex-row lg:flex-row justify-between items-center py-4 px-8">
      <div className="flex-grow text-center">
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "Edu VIC WA NT Beginner" }}
        >
          Git Begin
        </h1>
      </div>
      <div className="flex items-center pt-6 md:pt-0 lg:py-2 space-x-4">

        <ChangeLanguage />

        <GitHubButton href="https://github.com/The-Enthusiast-404/git-begin">Star</GitHubButton>

        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default NavBar
