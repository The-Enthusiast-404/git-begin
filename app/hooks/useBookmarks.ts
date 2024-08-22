import { useState, useEffect } from "react"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bookmarks")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    }
  }, [bookmarks])

  const toggleBookmark = (issueId: string) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.includes(issueId)
        ? prevBookmarks.filter((id) => id !== issueId)
        : [...prevBookmarks, issueId]
    )
  }

  const isBookmarked = (issueId: string) => bookmarks.includes(issueId)

  return { bookmarks, toggleBookmark, isBookmarked }
}
