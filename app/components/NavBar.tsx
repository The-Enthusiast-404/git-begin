import ThemeToggle from "~/components/ToggleTheme"

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex-grow text-center">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "Edu VIC WA NT Beginner" }}>Git Begin</h1>
      </div>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
export default NavBar
