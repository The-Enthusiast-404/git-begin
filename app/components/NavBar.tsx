import ThemeToggle from "~/components/ToggleTheme"
import GitHubButton from "react-github-btn"
import ChangeLanguage from "~/components/ChangeLanguage"

const NavBar = () => {
  
  return (
    <nav className="flex justify-between items-center py-4 px-8">
      <div className="flex-grow text-center">
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "Edu VIC WA NT Beginner" }}
        >
          Git Begin
        </h1>
      </div>
      <div className="flex items-start space-x-4">

        <GitHubButton href="https://github.com/The-Enthusiast-404/git-begin">Star</GitHubButton>

        <ChangeLanguage />

        <ThemeToggle />
      </div>
    </nav>
  )
}

export default NavBar
