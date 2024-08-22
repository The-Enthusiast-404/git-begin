import React from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"

interface BookmarkButtonProps {
  isBookmarked: boolean
  onClick: () => void
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onClick,
}) => {
  return (
    <Button
      size="icon"
      onClick={onClick}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  )
}

export default BookmarkButton
